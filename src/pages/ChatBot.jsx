import React from 'react';
import UnifiedChat from '../components/UnifiedChat';

const ChatBot = () => {
  return (
    <div className="min-h-screen bg-[#f0f7f4] pt-24 pb-6 px-4 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200/40 rounded-full blur-[80px]" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#688557]/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-xl border border-white/50 overflow-hidden flex flex-col h-[80vh] relative z-10">
        <UnifiedChat />
      </div>
    </div>
  );
};

export default ChatBot;
