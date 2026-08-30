import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, AlertCircle, Leaf, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Message } from '../types';
import { sendChatMessage, createChatSession, saveSessionMessage } from '../services/chatbotApiService';

interface AnimatedBotMessageProps {
  content: string;
  isLatest: boolean;
  onUpdateScroll?: () => void;
}

// Markdown-like parser for bold and lists
const FormattedMessageText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} className="h-1.5" />;
        }

        // Render list items
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('- ');
        const isNumbered = /^\d+\.\s/.test(line.trim());

        const renderFormattedLine = (str: string) => {
          // Parse bold (**text**)
          const parts = str.split(/(\*\*.*?\*\*)/g);
          return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={i} className="font-semibold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={i}>{part}</span>;
          });
        };

        if (isBullet) {
          const cleanText = line.trim().replace(/^[•\-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-emerald-600 font-bold leading-relaxed">•</span>
              <span className="flex-1">{renderFormattedLine(cleanText)}</span>
            </div>
          );
        }

        if (isNumbered) {
          const match = line.trim().match(/^(\d+\.)\s*(.*)$/);
          if (match) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-emerald-700 font-semibold text-xs mt-0.5 min-w-[1.25rem]">{match[1]}</span>
                <span className="flex-1">{renderFormattedLine(match[2])}</span>
              </div>
            );
          }
        }

        return <p key={idx} className="leading-relaxed">{renderFormattedLine(line)}</p>;
      })}
    </div>
  );
};

const AnimatedBotMessage: React.FC<AnimatedBotMessageProps> = ({ content, isLatest, onUpdateScroll }) => {
  const [displayedLength, setDisplayedLength] = useState(() => (isLatest ? 0 : content.length));
  const [isTyping, setIsTyping] = useState(() => isLatest);

  useEffect(() => {
    if (!isLatest) {
      setDisplayedLength(content.length);
      setIsTyping(false);
      return;
    }

    setDisplayedLength(0);
    setIsTyping(true);
    let index = 0;
    const totalChars = content.length;
    // Dynamic typing speed: faster for longer messages so the user isn't kept waiting
    const speed = totalChars > 300 ? 10 : totalChars > 150 ? 15 : 22;
    const stepSize = totalChars > 500 ? 3 : totalChars > 250 ? 2 : 1;

    const interval = setInterval(() => {
      index += stepSize;
      if (index >= totalChars) {
        setDisplayedLength(totalChars);
        setIsTyping(false);
        clearInterval(interval);
        if (onUpdateScroll) onUpdateScroll();
      } else {
        setDisplayedLength(index);
        if (onUpdateScroll && index % 6 === 0) onUpdateScroll();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, isLatest]);

  const currentText = content.slice(0, displayedLength);

  return (
    <div
      onClick={() => {
        if (isTyping) {
          setDisplayedLength(content.length);
          setIsTyping(false);
        }
      }}
      className="relative cursor-pointer"
      title={isTyping ? "Click to show full message" : undefined}
    >
      <FormattedMessageText text={currentText} />
      {isTyping && (
        <span
          className="inline-block w-1.5 h-4 ml-1 bg-emerald-600 rounded-sm animate-pulse align-middle"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

const UnifiedChat: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.name.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await createChatSession(userDetails);
      if (data.success) {
        setSessionId(data.sessionId);
        setIsSessionActive(true);
        setMessages([
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Hello ${userDetails.name}! 🌿 I am your AgriNex Vertical Farming Mentor.\nHow can I help you grow today? Ask me about hydroponics, nutrient balance, LED lighting, or crop health!`,
            timestamp: new Date()
          }
        ]);
        setTimeout(() => inputRef.current?.focus(), 200);
      } else {
        setError(data.message || 'Failed to start session');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Network error starting session. Is backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading]);

  const handleSendText = async () => {
    if (!input.trim() || isLoading) return;

    const currentText = input.trim();
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: currentText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = messages.map(msg => ({
        sender: msg.role,
        text: msg.content
      }));

      const responseText = await sendChatMessage(currentText, chatHistory);

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
          await saveSessionMessage(sessionId, 'user', currentText);
          await saveSessionMessage(sessionId, 'assistant', assistantMsg.content);
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

  const suggestions = [
    "What is the ideal pH for hydroponic lettuce?",
    "How much light do vertical farm strawberries need?",
    "వర్టికల్ ఫార్మింగ్ అంటే ఏమిటి?",
    "How to prevent root rot in indoor systems?"
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#f8faf9] to-[#edf6f1] select-none sm:select-auto">
      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4 max-w-4xl mx-auto w-full overscroll-contain"
      >
        {!isSessionActive ? (
          <div className="min-h-full flex flex-col items-center justify-center text-slate-400 py-4 px-2 sm:px-6">
            <div className="bg-white/95 backdrop-blur-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-emerald-100/80 max-w-sm sm:max-w-md w-full relative overflow-hidden text-center transition-all">
              {/* Clean botanical accent (No stars) */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-[#1F3B21] to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10 mb-4 sm:mb-5 mx-auto text-white">
                <Leaf size={28} className="sm:w-8 sm:h-8" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-2 tracking-tight">
                AgriNex AI Mentor
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 sm:mb-6">
                Your intelligent companion for high-yield vertical farming, hydroponics, and smart crop care.
              </p>

              <form onSubmit={handleStartSession} className="space-y-3 sm:space-y-4 text-left relative z-10">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userDetails.name}
                    onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="e.g. Alex Farmer"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={userDetails.email}
                    onChange={e => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="alex@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !userDetails.name.trim()}
                  className="w-full mt-2 bg-[#1F3B21] hover:bg-[#182f1a] active:scale-[0.98] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Start Farming Chat</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isLastAssistant = msg.role === 'assistant' && index === messages.length - 1;
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  <div
                    className={`flex gap-2 sm:gap-3 max-w-[88%] sm:max-w-[82%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border text-xs sm:text-sm font-medium ${
                        msg.role === 'user'
                          ? 'bg-[#1F3B21] border-[#1F3B21] text-white'
                          : 'bg-white border-emerald-200/80 text-emerald-700'
                      }`}
                    >
                      {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm break-words [overflow-wrap:anywhere] ${
                        msg.role === 'user'
                          ? 'bg-[#1F3B21] text-white rounded-tr-xs shadow-emerald-950/10'
                          : 'bg-white text-slate-800 rounded-tl-xs border border-emerald-100/70 shadow-slate-200/50'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <AnimatedBotMessage
                          content={msg.content}
                          isLatest={isLastAssistant}
                          onUpdateScroll={() => scrollToBottom(false)}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}

                      <div
                        className={`text-[9px] sm:text-[10px] mt-1.5 flex items-center gap-1 font-semibold uppercase tracking-wider ${
                          msg.role === 'user' ? 'text-emerald-200/70 justify-end' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp instanceof Date
                          ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Suggestions Chips (only if conversation is short) */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2 pb-1 space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pl-1">
                  Suggested Questions:
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(item);
                        inputRef.current?.focus();
                      }}
                      className="text-left text-xs bg-white hover:bg-emerald-50 active:scale-95 text-slate-700 hover:text-emerald-800 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all shadow-2xs font-medium"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Typing Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-150">
            <div className="flex gap-2 sm:gap-3 items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-emerald-200/80 shadow-sm flex items-center justify-center text-emerald-700">
                <Bot size={15} />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-2.5 border border-emerald-100 shadow-sm flex items-center gap-2">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-emerald-700 rounded-full animate-bounce"></span>
                </div>
                <span className="text-[11px] font-medium text-slate-400">Analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      {isSessionActive && (
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-2.5 sm:p-3.5 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            {error && (
              <div className="flex items-center justify-between gap-2 text-red-700 text-xs bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />
                  <span className="font-medium truncate">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-700 hover:text-red-900 font-bold text-[11px] shrink-0 uppercase tracking-wider underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="flex-1 relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask anything about vertical farming..."
                  disabled={isLoading}
                  className="w-full pl-3.5 pr-11 sm:pl-4 sm:pr-12 py-2.5 sm:py-3 bg-slate-50 hover:bg-white focus:bg-white rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-base sm:text-sm text-slate-800 placeholder-slate-400 shadow-inner"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendText();
                    }
                  }}
                />
                <button
                  onClick={handleSendText}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="absolute right-1.5 sm:right-2 top-1.5 bottom-1.5 w-8 h-8 sm:w-9 sm:h-9 bg-[#1F3B21] hover:bg-[#152a17] active:scale-95 disabled:opacity-0 text-white rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-sm cursor-pointer"
                >
                  <Send size={15} className="translate-x-px" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center px-1 text-[10px] text-slate-400">
              <span className="hidden sm:inline">Press Enter to send</span>
              <span className="mx-auto sm:mx-0 font-medium">Powered by AgriNex Assistant</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedChat;
