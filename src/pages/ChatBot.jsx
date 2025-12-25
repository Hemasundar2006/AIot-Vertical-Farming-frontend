import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Sprout, Mic, MicOff, Volume2, Settings, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateResponse } from '../utils/verticalFarmingKnowledgeBase';
import { generateGeminiResponse, isGeminiConfigured } from '../services/geminiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { initializeSocket, isSocketConnected, disconnectSocket } from '../services/socketService';
import toast, { Toaster } from 'react-hot-toast';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Vertical Farming AI Assistant. Ask me anything about vertical farming and I'll give you clear, focused answers. You can type your question or use the microphone button 🎤 to speak. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useGemini, setUseGemini] = useState(isGeminiConfigured());
  const [useSocket, setUseSocket] = useState(false);
  const [useHttpApi, setUseHttpApi] = useState(true); // Default to HTTP API
  const [socketConnected, setSocketConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Speech recognition hook
  const {
    isListening,
    transcript,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  // Initialize Socket.IO connection
  useEffect(() => {
    if (useSocket) {
      const socket = initializeSocket();
      let hasConnected = false;
      let connectionTimeout;
      
      const handleConnect = () => {
        setSocketConnected(true);
        hasConnected = true;
        if (connectionTimeout) clearTimeout(connectionTimeout);
        toast.success('Connected to server via Socket.IO', { icon: '🔌', duration: 2000 });
      };

      const handleDisconnect = (reason) => {
        setSocketConnected(false);
        // Only show error if we were previously connected (not initial connection attempts)
        if (hasConnected && reason !== 'io client disconnect') {
          toast.error('Disconnected from server', { icon: '🔌', duration: 3000 });
        }
      };

      const handleConnectError = (error) => {
        // Don't show error for expected WebSocket fallbacks
        const isWebSocketFallback = error.message && (
          error.message.includes('websocket') || 
          error.message.includes('WebSocket')
        );
        
        if (!isWebSocketFallback) {
          // Only log actual connection errors, not WebSocket fallbacks
          console.warn('Socket connection issue:', error.message);
        }
        
        // Don't immediately set to false - let it try polling
        // Only set to false if connection truly fails after timeout
      };

      const handleReconnectFailed = () => {
        setSocketConnected(false);
        toast.error('Failed to connect to server. Check your connection.', { 
          icon: '❌', 
          duration: 4000 
        });
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);
      socket.on('reconnect_failed', handleReconnectFailed);

      // Check initial connection status after a short delay
      // (to allow WebSocket fallback to polling if needed)
      connectionTimeout = setTimeout(() => {
        setSocketConnected(isSocketConnected());
      }, 2000);

      return () => {
        if (connectionTimeout) clearTimeout(connectionTimeout);
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
        socket.off('reconnect_failed', handleReconnectFailed);
      };
    } else {
      disconnectSocket();
      setSocketConnected(false);
    }
  }, [useSocket]);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Text-to-speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const userQuestion = input;
    setInput('');
    resetTranscript();
    setIsTyping(true);

    try {
      let response;
      
      if (useGemini && isGeminiConfigured()) {
        // Use Gemini AI for live responses (with optional HTTP API or Socket.IO)
        response = await generateGeminiResponse(userQuestion, messages, useSocket && socketConnected, useHttpApi);
        
        if (response.includes('API Key Error')) {
          // Fallback to knowledge base if API key issue
          toast.error('Gemini API not configured. Using built-in knowledge base.');
          response = generateResponse(userQuestion);
        }
      } else {
        // Use built-in knowledge base
        response = generateResponse(userQuestion);
      }
      
      const botMsg = { id: Date.now() + 1, text: response, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      
      // Optional: Speak the response
      // Uncomment the line below if you want automatic text-to-speech
      // speakText(response);
      
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMsg = { 
        id: Date.now() + 1, 
        text: "I apologize, but I encountered an error. Please try again.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsTyping(false);
      toast.error('Failed to get response. Please try again.');
    }
  };

  const handleMicClick = () => {
    if (!isSpeechSupported) {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      stopListening();
      toast.success('Microphone stopped');
    } else {
      startListening();
      toast.success('Listening... Speak now!', {
        icon: '🎤',
        duration: 2000
      });
    }
  };

  const handleSpeakResponse = (text) => {
    speakText(text);
    toast.success('Speaking response...', {
      icon: '🔊',
      duration: 1000
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f7f4] pt-24 pb-6 px-4 font-sans flex flex-col items-center justify-center relative overflow-hidden">
        <Toaster position="top-center" />
        
        {/* Background Decor */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200/40 rounded-full blur-[80px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#688557]/20 rounded-full blur-[100px]" />

        <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl border border-white/50 overflow-hidden flex flex-col h-[80vh] relative z-10">
            
            {/* Header */}
            <div className="bg-[#688557] p-6 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner border border-white/30">
                        <Bot size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            Vertical Farming AI <Sparkles size={16} className="text-yellow-300" />
                        </h1>
                        <p className="text-emerald-100/80 text-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> 
                            {useGemini && isGeminiConfigured() ? 'Gemini AI Powered' : 'Knowledge Base Mode'}
                            {useSocket && socketConnected && <span className="ml-2 flex items-center gap-1"><Wifi size={12} /> Socket.IO</span>}
                        </p>
                    </div>
                </div>
                
                {/* Settings Button */}
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Settings"
                >
                    <Settings size={20} className="text-white" />
                </button>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-50 border-b border-slate-200 overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Use Gemini AI</p>
                                    <p className="text-xs text-slate-500">
                                        {isGeminiConfigured() 
                                            ? 'Live AI responses with advanced understanding' 
                                            : 'Configure API key in src/config/gemini.js'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setUseGemini(!useGemini)}
                                    disabled={!isGeminiConfigured()}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        useGemini && isGeminiConfigured() ? 'bg-[#688557]' : 'bg-gray-300'
                                    } ${!isGeminiConfigured() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            useGemini ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Use HTTP API</p>
                                    <p className="text-xs text-slate-500">
                                        {useHttpApi 
                                            ? 'Using REST API endpoint (/api/chatbot)' 
                                            : 'Use HTTP API for backend communication'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setUseHttpApi(!useHttpApi)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        useHttpApi ? 'bg-[#688557]' : 'bg-gray-300'
                                    } cursor-pointer`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            useHttpApi ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Use Socket.IO</p>
                                    <p className="text-xs text-slate-500">
                                        {socketConnected 
                                            ? 'Connected to backend server' 
                                            : 'Connect to backend for real-time responses'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setUseSocket(!useSocket)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        useSocket ? 'bg-[#688557]' : 'bg-gray-300'
                                    } cursor-pointer`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            useSocket ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Voice Input</p>
                                    <p className="text-xs text-slate-500">
                                        {isSpeechSupported 
                                            ? 'Click the microphone to speak your question' 
                                            : 'Not supported in your browser'}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    isSpeechSupported 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {isSpeechSupported ? 'Available' : 'Unavailable'}
                                </div>
                            </div>
                            
                            {useSocket && (
                                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                    <div className="flex items-center gap-2">
                                        {socketConnected ? (
                                            <Wifi size={16} className="text-green-600" />
                                        ) : (
                                            <WifiOff size={16} className="text-red-600" />
                                        )}
                                        <span className="text-xs text-slate-600">
                                            {socketConnected ? 'Server Connected' : 'Connecting...'}
                                        </span>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        socketConnected 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {socketConnected ? 'Online' : 'Offline'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
                {messages.map((msg) => (
                    <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-end gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-[#688557] text-white'
                            }`}>
                                {msg.sender === 'user' ? <User size={16} /> : <Sprout size={16} />}
                            </div>

                            {/* Bubble */}
                            <div className="flex flex-col gap-2">
                                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                                    msg.sender === 'user' 
                                        ? 'bg-white text-slate-800 rounded-br-none border border-slate-100' 
                                        : 'bg-[#688557] text-white rounded-bl-none shadow-emerald-900/10'
                                }`}>
                                    <div className="whitespace-pre-line">{msg.text}</div>
                                </div>
                                
                                {/* Speak button for bot messages */}
                                {msg.sender === 'bot' && (
                                    <button
                                        onClick={() => handleSpeakResponse(msg.text)}
                                        className="self-start flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-[#688557] transition-colors"
                                        title="Listen to response"
                                    >
                                        <Volume2 size={14} />
                                        <span>Listen</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex justify-start"
                        >
                            <div className="flex items-end gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#688557] text-white flex items-center justify-center shrink-0">
                                    <Sprout size={16} />
                                </div>
                                <div className="bg-[#688557] p-4 rounded-2xl rounded-bl-none shadow-md flex gap-1 items-center h-12">
                                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100">
                {/* Listening Indicator */}
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 flex items-center justify-center gap-2 text-sm text-[#688557] font-medium"
                    >
                        <div className="flex gap-1">
                            <span className="w-1 h-4 bg-[#688557] rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                            <span className="w-1 h-4 bg-[#688557] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <span className="w-1 h-4 bg-[#688557] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span>Listening...</span>
                    </motion.div>
                )}
                
                <form onSubmit={handleSend} className="relative flex items-center gap-3">
                    {/* Microphone Button */}
                    {isSpeechSupported && (
                        <button
                            type="button"
                            onClick={handleMicClick}
                            className={`p-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 ${
                                isListening 
                                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                    : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                            }`}
                            title={isListening ? 'Stop listening' : 'Start voice input'}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                    )}
                    
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Type or speak your question..."}
                        className="flex-1 bg-slate-50 text-slate-800 pl-6 pr-14 py-4 rounded-full border border-slate-200 focus:ring-2 focus:ring-[#688557]/20 focus:border-[#688557] outline-none transition-all placeholder-slate-400 font-medium shadow-inner"
                    />
                    
                    <button 
                        type="submit"
                        className="absolute right-2 p-2.5 bg-[#688557] hover:bg-[#5a744b] rounded-full text-white transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                        disabled={!input.trim()}
                    >
                        <Send size={20} className="ml-0.5 group-hover:-rotate-12 transition-transform" />
                    </button>
                </form>
                
                <p className="text-center text-xs text-slate-400 mt-3">
                    {useGemini && isGeminiConfigured() 
                        ? '🤖 Powered by Google Gemini AI with vertical farming knowledge' 
                        : '📚 Powered by comprehensive vertical farming knowledge base'}
                </p>
            </div>
        </div>
    </div>
  );
};

export default ChatBot;
