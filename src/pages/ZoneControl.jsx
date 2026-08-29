import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import { filterLayersForUser } from '../utils/zoneUtils';
import { Power, PowerOff, Zap, Droplets } from 'lucide-react';

const ZoneControl = () => {
    const { layers, controlZoneManual } = useFarm();
    const { user } = useAuth();
    const [loadingZone, setLoadingZone] = useState(null);
    
    const filteredLayers = filterLayersForUser(layers, user);

    const handleControl = async (zoneId, turnOn) => {
        setLoadingZone(zoneId);
        try {
            await controlZoneManual(zoneId, turnOn);
        } finally {
            setLoadingZone(null);
        }
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] pt-28 pb-12 px-4 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">
                        Manual <span className="text-emerald-600">Zone Control</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-base lg:text-lg">
                        Control moisture thresholds and motor automation for each zone.
                        <span className="block text-sm text-slate-400 mt-1 font-medium">
                          • Moisture &gt; 70% &rarr; Motor turns <strong className="text-red-500 font-bold">OFF</strong> (high soil moisture) <br />
                          • Moisture &lt; 30% &rarr; Motor turns <strong className="text-emerald-600 font-bold">ON</strong> (low soil moisture)
                        </span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredLayers.map((zone) => {
                        const isMotorOn = zone.motor === 'ON';
                        
                        return (
                            <div key={zone.id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner border border-slate-100">
                                    <Zap size={32} className={isMotorOn ? "text-emerald-500 animate-bounce" : "text-slate-300"} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{zone.name}</h3>
                                <p className="text-sm text-slate-500 mb-6">Zone {zone.id}</p>
                                
                                <div className="flex items-center gap-2 mb-6">
                                    <div className={`px-3 py-1 rounded-full text-sm md:text-xs font-bold border flex items-center gap-2 ${isMotorOn ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                        <div className={`w-2 h-2 rounded-full ${isMotorOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                        MOTOR {zone.motor}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm md:text-xs font-bold border flex items-center gap-1 ${
                                        zone.moisture > 70 
                                            ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                            : zone.moisture < 30 
                                                ? 'bg-amber-50 text-amber-600 border-amber-200' 
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                    }`}>
                                        <Droplets size={12} /> {zone.moisture}%
                                    </div>
                                </div>

                                <div className="flex gap-4 w-full">
                                    <button 
                                        onClick={() => handleControl(zone.id, true)}
                                        disabled={loadingZone === zone.id}
                                        className={`flex-1 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                                            zone.moisture > 70 
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                                        } disabled:opacity-50`}
                                        title="Increase moisture to > 70% (Motor turns OFF)"
                                    >
                                        <div className="flex items-center gap-1 text-sm">
                                            <Power size={16} /> ON
                                        </div>
                                        <span className="text-sm md:text-[10px] opacity-75 font-normal">&gt; 70% (Motor OFF)</span>
                                    </button>
                                    <button 
                                        onClick={() => handleControl(zone.id, false)}
                                        disabled={loadingZone === zone.id}
                                        className={`flex-1 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                                            zone.moisture < 30 
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500'
                                        } disabled:opacity-50`}
                                        title="Decrease moisture to < 30% (Motor turns ON)"
                                    >
                                        <div className="flex items-center gap-1 text-sm">
                                            <PowerOff size={16} /> OFF
                                        </div>
                                        <span className="text-sm md:text-[10px] opacity-75 font-normal">&lt; 30% (Motor ON)</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default ZoneControl;
