import React from 'react';

const Video360 = () => {
  return (
    <div className="pt-24 px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-amber-900/10 h-[600px] flex flex-col">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">360° Site View</h1>
        <p className="text-amber-800 mb-6">
          Immersive interactive viewer to explore the vertical farming facility.
        </p>
        <div className="flex-1 bg-gray-900 rounded-lg flex items-center justify-center border border-amber-900/20 overflow-hidden relative">
            <span className="text-white/50 text-lg">360 Video Player Placeholder</span>
        </div>
      </div>
    </div>
  );
};

export default Video360;
