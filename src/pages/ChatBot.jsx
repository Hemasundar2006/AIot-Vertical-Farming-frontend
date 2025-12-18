import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Sprout, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Farm Assistant. Ask me anything about your crop health, irrigation schedules, or pest control.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const responses = [
          "Based on your sensor data, your basil nitrogen levels are slightly low. I recommend increasing the nutrient solution flow by 5%.",
          "The current humidity in Zone 2 is ideal for lettuce growth. No adjustments needed.",
          "I've detected a potential risk of root rot in Tower 4 due to over-saturation. Please check the drainage system.",
          "Your energy consumption has optimized by 12% this week thanks to the new LED schedule."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMsg = { id: Date.now() + 1, text: randomResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f0f7f4] pt-24 pb-6 px-4 font-sans flex flex-col items-center justify-center relative overflow-hidden">
        
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
                            Farm Assistant AI <Sparkles size={16} className="text-yellow-300" />
                        </h1>
                        <p className="text-emerald-100/80 text-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Online & Monitoring System
                        </p>
                    </div>
                </div>
            </div>

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
                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                                msg.sender === 'user' 
                                    ? 'bg-white text-slate-800 rounded-br-none border border-slate-100' 
                                    : 'bg-[#688557] text-white rounded-bl-none shadow-emerald-900/10'
                            }`}>
                                {msg.text}
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
                <form onSubmit={handleSend} className="relative flex items-center gap-4">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..."
                        className="w-full bg-slate-50 text-slate-800 pl-6 pr-14 py-4 rounded-full border border-slate-200 focus:ring-2 focus:ring-[#688557]/20 focus:border-[#688557] outline-none transition-all placeholder-slate-400 font-medium shadow-inner"
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
                    AI can make mistakes. Verify important farm data.
                </p>
            </div>
        </div>
    </div>
  );
};

export default ChatBot;
