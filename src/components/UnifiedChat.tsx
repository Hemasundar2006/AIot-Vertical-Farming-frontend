import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, Loader2, Mic, MicOff, Volume2, AlertCircle, Sparkles } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Message } from '../types';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';
import { GEMINI_API_KEY } from '../config/gemini';

const KNOWLEDGE_BASE_DATA = `
Vertical farming is a method of growing crops in vertically stacked layers.
How it works: Hydroponics (water), Aeroponics (mist), Aquaponics (fish water). 
Crops: Leafy greens, herbs, strawberries. 
Benefits: 95-98% less water, year-round production, no pesticides.
History: Modern concept by Dickson Despommier (1999).
India Context: Addressing land and water scarcity in urban areas.
Language Support: English and Telugu.
Tone: Expert, helpful, student-friendly.
`;

const SYSTEM_INSTRUCTION = `
You are AgriNex, a warm, passionate, and encouraging mentor specialized in Vertical Farming.
Your mission is to explain vertical farming concepts to students and enthusiasts in a friendly, conversational way.

EXPLANATION STYLE:
- DO NOT use bullet points, bold headers, or structured lists.
- Write in a natural, narrative paragraph style, like a teacher explaining a concept to a student.
- Keep the explanation smooth and easy to read.
- When explaining a concept, weave the facts together into a single, cohesive story.

PERSONALITY & DATA RECOGNITION:
- Be extremely friendly. Use phrases like "I'm so glad you're curious about this!" or "That's a wonderful thing to ask!"
- Explicitly mention that your answer comes from your training data using natural phrases like "In our specialized records for vertical farming, it says..." or "Based on the data I've been given to share with you..."
- Sound like a mentor who is genuinely excited.

KNOWLEDGE SOURCE RESTRICTION:
- Use ONLY the data provided below.
- If the information is not in the data, say: "That's a great question! However, based on the specific vertical farming data I have right now, I don't have that information. I'd love to tell you more about things I do know, like [mention a topic from the data]!"

LANGUAGE:
- Respond in the same language as the user (English or Telugu). 

KNOWLEDGE DATA:
${KNOWLEDGE_BASE_DATA}
`;

const UnifiedChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const sessionRef = useRef<any>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendText = async () => {
    if (!input.trim() || isLoading || isLiveActive) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('Gemini API key not configured');
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.8,
        }
      });

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't find an answer in my farming records.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to reach the farming expert. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopLiveSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    inputAudioCtxRef.current?.close();
    outputAudioCtxRef.current?.close();
    inputAudioCtxRef.current = null;
    outputAudioCtxRef.current = null;
    setIsLiveActive(false);
    setIsConnecting(false);
  }, []);

  const startLiveSession = async () => {
    if (isLoading) return;
    setIsConnecting(true);
    setError(null);

    try {
      const apiKey = GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('Gemini API key not configured');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const outputNode = outputAudioCtxRef.current.createGain();
      outputNode.connect(outputAudioCtxRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsLiveActive(true);

            const source = inputAudioCtxRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioCtxRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioCtxRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
            }
            if (message.serverContent?.turnComplete) {
              const userText = currentInputTranscriptionRef.current;
              const modelText = currentOutputTranscriptionRef.current;
              
              if (userText) {
                setMessages(prev => [...prev, {
                  id: crypto.randomUUID(),
                  role: 'user',
                  content: userText,
                  timestamp: new Date(),
                  isAudio: true
                }]);
              }
              if (modelText) {
                setMessages(prev => [...prev, {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: modelText,
                  timestamp: new Date(),
                  isAudio: true
                }]);
              }
              currentInputTranscriptionRef.current = '';
              currentOutputTranscriptionRef.current = '';
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioCtxRef.current) {
              const ctx = outputAudioCtxRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error(e);
            setError('Audio connection failed.');
            stopLiveSession();
          },
          onclose: () => stopLiveSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not start audio session.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full"
      >
        {messages.length === 0 && !isLiveActive && !isConnecting && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 text-center px-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-green-100/50 border border-green-100 max-w-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={80} className="text-green-600" />
              </div>
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 mx-auto">
                <Bot size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Welcome to AgriNex!</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Hello! I'm your vertical farming mentor. I'm here to explain how we can grow fresh food in amazing ways! Just ask me a question to get started. 🌿
              </p>
              <div className="space-y-3 text-left">
                <button onClick={() => setInput("Can you explain what Hydroponics is?")} className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-green-300 hover:bg-green-50 transition-colors">
                  "Can you explain what Hydroponics is?"
                </button>
                <button onClick={() => setInput("వర్టికల్ ఫార్మింగ్ అంటే ఏమిటి?")} className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-green-300 hover:bg-green-50 transition-colors">
                  "వర్టికల్ ఫార్మింగ్ అంటే ఏమిటి?"
                </button>
              </div>
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                msg.role === 'user' ? 'bg-green-600 border-green-500' : 'bg-white border-slate-200'
              }`}>
                {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-green-600" />}
              </div>
              <div className={`rounded-2xl px-5 py-4 text-sm shadow-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-green-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-[10px] mt-3 flex items-center gap-1.5 font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-green-100' : 'text-slate-400'}`}>
                  {msg.isAudio && <Volume2 size={10} className="animate-pulse" />}
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                <Bot size={18} className="text-green-600 animate-bounce" />
              </div>
              <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-green-100 p-4 pb-8 sm:pb-6 shadow-[0_-4px_30px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 px-4 py-3 rounded-xl border border-red-100 self-center">
              <AlertCircle size={14} />
              <span className="font-medium">{error}</span>
              <button onClick={() => setError(null)} className="ml-4 hover:underline font-bold uppercase tracking-tighter">Dismiss</button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={isLiveActive ? stopLiveSession : startLiveSession}
              disabled={isConnecting}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                isLiveActive 
                  ? 'bg-red-500 text-white' 
                  : isConnecting
                    ? 'bg-slate-200 text-slate-400 cursor-wait'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isConnecting ? <Loader2 size={24} className="animate-spin" /> : isLiveActive ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder={isLiveActive ? "Voice mode active..." : "Ask your mentor a question..."}
                disabled={isLiveActive || isConnecting || isLoading}
                className="w-full pl-6 pr-14 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              />
              <button 
                onClick={handleSendText}
                disabled={!input.trim() || isLoading || isLiveActive || isConnecting}
                className="absolute right-2 top-2 bottom-2 bg-green-600 text-white px-4 rounded-xl hover:bg-green-700 disabled:opacity-0 transition-all shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400">
            Powered by Google Gemini AI • Voice and text support
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedChat;

