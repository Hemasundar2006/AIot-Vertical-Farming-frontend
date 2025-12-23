import React, { useMemo } from 'react';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Wind, CloudFog, Zap, Activity, ChevronRight, Sun, Gauge, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const { layers, isConnected, togglePump, lastUpdated, isDemoMode } = useFarm();
    const navigate = useNavigate();

    // Calculate Overall Stats from "layers" (Zones)
    const overallStats = useMemo(() => {
        const zones = Object.values(layers);
        if (zones.length === 0) return { avgTemp: 0, avgHumidity: 0, avgGas: 0, avgLight: 0 };

        const totalTemp = zones.reduce((acc, z) => acc + (parseFloat(z.temperature) || 0), 0);
        const totalHum = zones.reduce((acc, z) => acc + (parseFloat(z.humidity) || 0), 0);
        const totalGas = zones.reduce((acc, z) => acc + (parseFloat(z.gas) || 0), 0);
        
        return {
            avgTemp: (totalTemp / zones.length).toFixed(1),
            avgHumidity: (totalHum / zones.length).toFixed(1),
            avgGas: Math.round(totalGas / zones.length),
        };
    }, [layers]);

    // Zone/Layer Card Component
    const ZoneCard = ({ zone }) => {
        const isPumpOn = zone.pumpInfo.status;
        
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
                {/* Header Gradient */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-10" />
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <CloudFog size={120} />
                </div>

                <div className="relative p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shadow-inner">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{zone.name}</h3>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                    ID: {zone.id} • {isConnected ? 'Live' : 'Connecting...'}
                                </p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border ${isPumpOn ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                            PUMP {isPumpOn ? 'ACTIVE' : 'IDLE'}
                        </div>
                    </div>

                    {/* Sensor Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                         <SensorBadge icon={Thermometer} label="Temp" value={`${zone.temperature}°C`} color="text-orange-500" bg="bg-orange-50" />
                         <SensorBadge icon={Droplets} label="Humidity" value={`${zone.humidity}%`} color="text-blue-500" bg="bg-blue-50" />
                         <SensorBadge icon={Gauge} label="Soil" value={`${zone.moisture}`} color="text-emerald-600" bg="bg-emerald-50" />
                         <SensorBadge icon={Wind} label="Gas" value={`${zone.gas}`} color="text-purple-500" bg="bg-purple-50" />
                    </div>
                    
                    {/* Light Level Bar */}
                    <div className="mb-6">
                         <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Sun size={12}/> Light Intensity</span>
                             <span className="text-xs font-bold text-amber-500">{zone.light} Lx</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(100, (zone.light / 1000) * 100)}%` }} 
                             />
                         </div>
                    </div>

                    {/* Controls */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-xs text-slate-400">
                            Status: <span className="text-slate-600 font-semibold">{isPumpOn ? 'Watering...' : 'Monitoring'}</span>
                        </div>
                        <button
                            onClick={() => togglePump(zone.id)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 ${
                                isPumpOn 
                                    ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200' 
                                    : 'bg-emerald-600 text-emerald-50 hover:bg-emerald-700 hover:shadow-emerald-200'
                            }`}
                        >
                            <Zap size={14} className={isPumpOn ? "" : "fill-current"} />
                            {isPumpOn ? 'Stop Pump' : 'Start Pump'}
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] pt-28 pb-12 px-4 lg:px-8 font-sans">
             <div className="max-w-[1600px] mx-auto">
                
                {/* Page Header - Improved Responsiveness */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 lg:mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-emerald-600 mb-2 font-medium bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                            <Activity size={14} /> <span>Live Dashboard</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">
                            Farm <span className="text-emerald-600">Overview</span>
                        </h1>
                        <p className="text-slate-500 mt-2 text-base lg:text-lg">
                            Results from {Object.keys(layers).length} Active Zones
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
                        {isDemoMode && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                                DEMO MODE
                            </span>
                        )}
                        <div className="flex items-center gap-2 text-slate-400 text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 w-full sm:w-auto justify-center">
                            <Clock size={16} />
                            <span>Last Updated: <span className="text-slate-700 font-mono font-bold whitespace-nowrap">
                                {lastUpdated ? (lastUpdated.includes(',') ? lastUpdated : `Today, ${lastUpdated}`) : 'Syncing...'}
                            </span></span>
                        </div>
                    </div>
                </div>

                {/* Overall Stats Cards - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
                    <StatCard 
                        icon={Thermometer} 
                        label="Avg. Temp" 
                        value={`${overallStats.avgTemp}°C`} 
                        sublabel="Optimum: 24°C"
                        color="text-orange-500" 
                        bgColor="bg-white"
                        trend="+1.2%"
                    />
                    <StatCard 
                        icon={Droplets} 
                        label="Avg. Humidity" 
                        value={`${overallStats.avgHumidity}%`} 
                        sublabel="Optimum: 60%"
                        color="text-blue-500" 
                        bgColor="bg-white"
                        trend="-0.5%"
                    />
                     <StatCard 
                        icon={Wind} 
                        label="Avg. Air Quality" 
                        value={`${overallStats.avgGas}`} 
                        sublabel="PPM"
                        color="text-purple-500" 
                        bgColor="bg-white"
                        trend="Stable"
                    />
                     <StatCard 
                        icon={Zap} 
                        label="System Status" 
                        value={isConnected ? "Online" : "Offline"} 
                        sublabel={isConnected ? "Data Streaming" : "Check Connection"}
                        color={isConnected ? "text-emerald-500" : "text-red-500"}
                        bgColor="bg-white"
                        trend="Live"
                    />
                </div>

                {/* Main Zone Grid - Responsive Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
                    
                    {/* Left: Zones */}
                    <div className="xl:col-span-8 flex flex-col gap-6 lg:gap-8 order-2 xl:order-1">
                         <div className="flex items-center justify-between">
                            <h2 className="text-xl lg:text-2xl font-bold text-slate-800">Active Zones</h2>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            {Object.values(layers).map((layer) => (
                                <ZoneCard key={layer.id} zone={layer} />
                            ))}
                         </div>
                    </div>

                    {/* Right: Analytics / Sidebar - Reordered for Mobile */}
                    <div className="xl:col-span-4 space-y-6 lg:space-y-8 order-1 xl:order-2">
                        
                        {/* Environmental Chart */}
                        <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                             <div className="flex justify-between items-center mb-6 relative z-10">
                                 <h3 className="font-bold text-slate-800 text-lg">Growth Index</h3>
                                 <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                                     <ChevronRight size={16} className="text-slate-400" />
                                 </button>
                             </div>

                             {/* Chart */}
                             <div className="h-40 w-full relative z-10">
                                 <ResponsiveContainer width="100%" height="100%">
                                     <AreaChart data={[
                                         {name: '1', val: 30}, {name: '2', val: 40}, {name: '3', val: 35}, 
                                         {name: '4', val: 50}, {name: '5', val: 45}, {name: '6', val: 60},
                                         {name: '7', val: 55}, {name: '8', val: 70}
                                     ]}>
                                         <defs>
                                             <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                             </linearGradient>
                                         </defs>
                                         <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
                                     </AreaChart>
                                 </ResponsiveContainer>
                             </div>
                             
                             <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                                 <span>Efficiency Rate:</span>
                                 <span className="font-bold text-emerald-600">94%</span>
                             </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-emerald-900 rounded-[2rem] p-6 lg:p-8 shadow-2xl relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            
                            <h3 className="font-bold text-2xl mb-2 relative z-10">AI Insights</h3>
                            <p className="text-emerald-200/80 mb-6 text-sm relative z-10">
                                Crop health analysis suggests increasing moisture in Zone 2 by 5%.
                            </p>

                            <button 
                                onClick={() => navigate('/predictions')}
                                className="w-full py-4 bg-white text-emerald-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 relative z-10"
                            >
                                View Detailed Report <ChevronRight size={16} />
                            </button>
                        </div>

                    </div>
                </div>
             </div>
        </main>
    );
};

// Helper Components
const SensorBadge = ({ icon: Icon, label, value, color, bg }) => (
    <div className={`flex flex-col gap-1 p-3 rounded-2xl ${bg} border border-opacity-50 border-slate-100`}>
        <div className={`flex items-center gap-2 ${color}`}>
            <Icon size={16} />
            <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
        </div>
        <span className="text-lg font-bold text-slate-700">{value}</span>
    </div>
);

const StatCard = ({ icon: Icon, label, value, sublabel, color, bgColor, trend }) => (
    <div className={`p-6 rounded-[2rem] ${bgColor} border border-slate-100 shadow-lg shadow-slate-100/50 flex flex-col justify-between h-36 hover:-translate-y-1 transition-transform duration-300`}>
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${color.replace('text', 'bg')}/10 ${color}`}>
                <Icon size={22} />
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-black text-slate-800">{value}</h4>
                <span className="text-xs text-slate-400 font-medium">{sublabel}</span>
            </div>
        </div>
    </div>
);

export default Dashboard;
