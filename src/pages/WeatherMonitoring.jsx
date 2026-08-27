import React from 'react';

const WeatherMonitoring = () => {
  return (
    <div className="pt-24 px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-amber-900/10">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Satellite Weather Monitoring</h1>
        <p className="text-amber-800 mb-6">
          Real-time weather conditions and API-driven predictions for your farming site.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100">
             <h3 className="text-lg font-semibold text-blue-900">Current Temp</h3>
             <p className="text-3xl font-bold text-blue-800 mt-2">-- °C</p>
          </div>
          <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100">
             <h3 className="text-lg font-semibold text-blue-900">Precipitation</h3>
             <p className="text-3xl font-bold text-blue-800 mt-2">-- %</p>
          </div>
          <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100">
             <h3 className="text-lg font-semibold text-blue-900">Forecast</h3>
             <p className="text-3xl font-bold text-blue-800 mt-2">Pending API</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMonitoring;
