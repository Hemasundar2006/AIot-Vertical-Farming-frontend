import React, { useState, useEffect } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Thermometer, Droplets, Wind, Zap, Gauge, Sun } from 'lucide-react';

const AdminTelemetry = () => {
    const { layers, isConnected, togglePump } = useFarm();
    const [loading, setLoading] = useState(true);

    // Filter zones: Admin sees all zones
    const layersList = Array.isArray(layers) ? layers : Object.values(layers || {});

    useEffect(() => {
        // Simulate a small loading delay for smooth UI transition
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <div className="text-center py-12 text-gray-500 font-medium">Connecting to ESP32 Network...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <Gauge size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-900">ESP32 Live Telemetry</h3>
                    <p className="text-sm text-gray-500">Real-time sensor data across all farm zones.</p>
                </div>
            </div>

            {layersList.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center">
                    <p className="text-gray-500 font-medium">No active ESP32 sensor zones detected on the network.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {layersList.map((zone) => {
                        const isPumpOn = isConnected && zone.pumpInfo?.status;
                        const motorStatus = isConnected ? (zone.motor || (isPumpOn ? 'ON' : 'OFF')) : 'OFF';
                        const isMotorActive = isConnected && motorStatus === 'ON';
                        
                        return (
                            <div key={zone.id} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-900/5 transition-all">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative z-10">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <div>
                                            <h2 className="text-xl font-black text-gray-800 mb-2">{zone.name || `Zone ${zone.id}`}</h2>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="text-sm md:text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">ESP32-{zone.id}</span>
                                                <span className={`text-sm md:text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border ${isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {isConnected ? '• Live' : 'Offline'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl text-sm md:text-xs font-black uppercase tracking-widest border-2 flex items-center justify-center sm:justify-start gap-2 ${isMotorActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isMotorActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                                            MOTOR {motorStatus}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <StatBox icon={Thermometer} label="Temp" value={isConnected ? `${zone.temperature}°C` : '--'} color="text-orange-500" bgColor="bg-orange-50" />
                                        <StatBox icon={Wind} label="Humidity" value={isConnected ? `${zone.humidity}%` : '--'} color="text-blue-500" bgColor="bg-blue-50" />
                                        <StatBox icon={Droplets} label="Moisture" value={isConnected ? `${zone.moisture}%` : '--'} color="text-emerald-500" bgColor="bg-emerald-50" />
                                        <StatBox icon={Sun} label="Light" value={isConnected ? `${zone.light}` : '--'} color="text-amber-500" bgColor="bg-amber-50" />
                                    </div>

                                    <button onClick={() => togglePump(zone.id)} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isMotorActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                                        {isMotorActive ? 'Emergency Stop Motor' : 'Manual Override: Start Motor'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const StatBox = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bgColor} ${color} transition-transform group-hover:scale-110`}>
            <Icon size={20} />
        </div>
        <p className="text-sm md:text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">{label}</p>
        <p className="text-lg font-black text-gray-800">{value}</p>
    </div>
);

export default AdminTelemetry;
