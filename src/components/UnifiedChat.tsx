import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { sendChatMessage } from '../services/chatbotApiService';

const UnifiedChat: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.name) return;
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';
      const response = await fetch(`${baseUrl}/chatbot/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails)
      });
      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setIsSessionActive(true);
        setMessages([
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Hi I am agri bot\nMay I help you',
            timestamp: new Date()
          }
        ]);
      } else {
        setError(data.message || 'Failed to start session');
      }
    } catch (err) {
      console.error(err);
      setError('Network error starting session. Is backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendText = async () => {
    if (!input.trim() || isLoading) return;

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
      const chatHistory = messages.map(msg => ({
        sender: msg.role,
        text: msg.content
      }));

      const responseText = await sendChatMessage(input, chatHistory);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseText || "I'm sorry, I couldn't find an answer right now.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Save to backend
      if (sessionId) {
        try {
          const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';
          await fetch(`${baseUrl}/chatbot/session/${sessionId}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'user', content: input, isAudio: false })
          });
          await fetch(`${baseUrl}/chatbot/session/${sessionId}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'assistant', content: assistantMsg.content, isAudio: false })
          });
        } catch (err) {
          console.error('Failed to save messages', err);
        }
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to reach the farming expert. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full"
      >
        {!isSessionActive ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 text-center px-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-green-100/50 border border-green-100 max-w-md relative overflow-hidden w-full">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={80} className="text-green-600" />
              </div>
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 mx-auto">
                <Bot size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Welcome to AgriNex!</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Hello! I'm your vertical farming mentor. Before we start, please tell me a bit about yourself. 🌿
              </p>

              <form onSubmit={handleStartSession} className="space-y-4 text-left relative z-10">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={userDetails.name}
                    onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={userDetails.email}
                    onChange={e => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !userDetails.name}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Start Chat'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
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
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-green-600 border-green-500' : 'bg-white border-slate-200'
                    }`}>
                    {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-green-600" />}
                  </div>
                  <div className={`rounded-2xl px-5 py-4 text-sm shadow-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-tr-none animate-glow-border'
                      : 'bg-white text-slate-800 rounded-tl-none animate-glow-subtle'
                    }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className={`text-[10px] mt-3 flex items-center gap-1.5 font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-green-100' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </>
        )}

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

      {isSessionActive && (
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
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Ask your mentor a question..."
                  disabled={isLoading}
                  className="w-full pl-6 pr-14 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm shadow-inner"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                />
                <button
                  onClick={handleSendText}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 bottom-2 bg-green-600 text-white px-4 rounded-xl hover:bg-green-700 disabled:opacity-0 transition-all shadow-md"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400">
              Powered by AgriNex Chatbot
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default UnifiedChat;
