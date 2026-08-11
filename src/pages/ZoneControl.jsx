import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Power, PowerOff, Zap, Droplets } from 'lucide-react';

const ZoneControl = () => {
    const { layers, controlZoneManual } = useFarm();
    const [loadingZone, setLoadingZone] = useState(null);

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
                        Directly control the motors for each zone and update ThingSpeak channels.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.values(layers).map((zone) => {
                        const isMotorOn = zone.motor === 'ON';
                        
                        return (
                            <div key={zone.id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner border border-slate-100">
                                    <Zap size={32} className={isMotorOn ? "text-emerald-500" : "text-slate-300"} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{zone.name}</h3>
                                <p className="text-sm text-slate-500 mb-6">Zone {zone.id}</p>
                                
                                <div className="flex items-center gap-2 mb-6">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${isMotorOn ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                        <div className={`w-2 h-2 rounded-full ${isMotorOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                        MOTOR {zone.motor}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${zone.moisture > 50 ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                                        <Droplets size={12} /> {zone.moisture}
                                    </div>
                                </div>

                                <div className="flex gap-4 w-full">
                                    <button 
                                        onClick={() => handleControl(zone.id, true)}
                                        disabled={loadingZone === zone.id}
                                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                            isMotorOn 
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                                        } disabled:opacity-50`}
                                    >
                                        <Power size={18} /> ON
                                    </button>
                                    <button 
                                        onClick={() => handleControl(zone.id, false)}
                                        disabled={loadingZone === zone.id}
                                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                            !isMotorOn 
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500'
                                        } disabled:opacity-50`}
                                    >
                                        <PowerOff size={18} /> OFF
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
