import React from 'react';

const DataDownload = () => {
  return (
    <div className="pt-24 px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-amber-900/10">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Data Download & Reports</h1>
        <p className="text-amber-800 mb-6">
          Export your farm data, analytics, and sensor history as downloadable reports.
        </p>
        <div className="flex gap-4">
          <button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg transition-colors">
            Download CSV
          </button>
          <button className="bg-amber-900 hover:bg-amber-950 text-white px-6 py-2 rounded-lg transition-colors">
            Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataDownload;
