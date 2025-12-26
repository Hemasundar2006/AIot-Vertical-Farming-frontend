import React from 'react';
import SensorGraphs from '../components/SensorGraphs';
import { Activity, BarChart3 } from 'lucide-react';

const SensorData = () => {
  return (
    <main className="min-h-screen bg-[#f8fafc] pt-28 pb-12 px-4 lg:px-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-emerald-600 mb-2 font-medium bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
            <Activity size={14} />
            <span>Sensor Analytics</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
              <BarChart3 size={32} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">
                Sensor <span className="text-emerald-600">Data Graphs</span>
              </h1>
              <p className="text-slate-500 mt-2 text-base lg:text-lg">
                Visualize daily and monthly sensor readings from your vertical farming system
              </p>
            </div>
          </div>
        </div>

        {/* Sensor Graphs Component */}
        <SensorGraphs />
      </div>
    </main>
  );
};

export default SensorData;

