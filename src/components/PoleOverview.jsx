import React from 'react';
import { useFarm } from '../context/FarmContext';
import { Thermometer, Droplets, Wind, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

const LayerCard = ({ layer, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 shadow-xl"
    >
      {/* Background Gradient Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-farm-accent/20 to-transparent blur-2xl rounded-full -mr-16 -mt-16 pointer-events-none`} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-farm-accent/20 rounded-lg text-farm-accent">
            <Sprout size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{layer.name}</h3>
            <p className="text-sm text-slate-400">Layer {layer.id}</p>
          </div>
        </div>
        {layer.pumpInfo.status && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium animate-pulse">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                Watering
            </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatItem 
          icon={<Thermometer size={18} />} 
          label="Temp" 
          value={`${layer.temperature}°C`} 
          color="text-orange-400"
          bg="bg-orange-500/10"
        />
        <StatItem 
          icon={<Wind size={18} />} 
          label="Humidity" 
          value={`${layer.humidity}%`} 
          color="text-blue-400"
          bg="bg-blue-500/10"
        />
        <StatItem 
          icon={<Droplets size={18} />} 
          label="Moisture" 
          value={`${layer.moisture}%`} 
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
      </div>
      
      {/* Progress Bar for Moisture */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Soil Moisture</span>
            <span>{layer.moisture}%</span>
        </div>
        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${layer.moisture}%` }}
                transition={{ duration: 1 }}
            />
        </div>
      </div>
    </motion.div>
  );
};

const StatItem = ({ icon, label, value, color, bg }) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-xl ${bg} border border-white/5`}>
    <div className={`mb-1 ${color}`}>{icon}</div>
    <span className="text-xs text-slate-400 mb-1">{label}</span>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

const PoleOverview = () => {
  const { layers } = useFarm();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
        <div className="h-8 w-1 bg-farm-accent rounded-full"/>
        Pole Overview
      </h2>
      <div className="flex flex-col gap-4">
        {Object.values(layers).map((layer, index) => (
          <LayerCard key={layer.id} layer={layer} index={index} />
        ))}
      </div>
    </div>
  );
};

export default PoleOverview;
