import React from 'react';
import { Video } from 'lucide-react';
import { motion } from 'framer-motion';

const LiveStream = () => {
  return (
    <main className="min-h-screen bg-[#f8fafc] pt-28 pb-12 px-4 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Video className="text-emerald-600" size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Live Workshop Stream
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Watch the YouTube live session directly inside your dashboard.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Responsive YouTube iframe */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              // Use the YouTube EMBED URL instead of the live/watch URL to avoid
              // "refused to connect" errors due to X-Frame-Options.
              src="https://www.youtube.com/embed/D8-BrAt9GDE"
              title="YouTube live stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default LiveStream;


