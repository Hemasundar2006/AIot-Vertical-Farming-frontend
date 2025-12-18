import React from 'react';
import { useFarm } from '../context/FarmContext';
import { Power } from 'lucide-react';

const ControlCard = ({ layer, onToggle }) => {
  const isActive = layer.pumpInfo.status;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-full transition-colors ${isActive ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-700 text-slate-400'}`}>
          <Power size={20} />
        </div>
        <div>
          <h4 className="font-medium text-white">{layer.name} Pump</h4>
          <p className="text-xs text-slate-400">{isActive ? 'Running' : 'Stopped'}</p>
        </div>
      </div>
      
      <button 
        onClick={() => onToggle(layer.id)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-farm-accent focus:ring-offset-2 focus:ring-offset-slate-900 ${isActive ? 'bg-farm-accent' : 'bg-slate-700'}`}
      >
        <span 
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} 
        />
      </button>
    </div>
  );
};

const ControlCenter = () => {
  const { layers, togglePump } = useFarm();

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="h-6 w-1 bg-blue-500 rounded-full"/>
            Control Center
        </h2>
        <span className="text-xs font-mono text-slate-400 border border-slate-700 px-2 py-1 rounded">
            MANUAL OVERRIDE
        </span>
      </div>
      
      <div className="space-y-4">
        {Object.values(layers).map((layer) => (
          <ControlCard 
            key={layer.id} 
            layer={layer} 
            onToggle={togglePump} 
          />
        ))}
      </div>
    </div>
  );
};

export default ControlCenter;
