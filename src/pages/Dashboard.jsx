import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Wind, CloudFog, Zap, Activity, ChevronRight, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const { layers, isConnected, togglePump } = useFarm();
    const navigate = useNavigate();

    // Mock Overall Data
    const overallStats = {
        avgTemp: 23.9,
        avgHumidity: 62.4,
        airQuality: 'Good (59 AQI)',
        co2: 446
    };

    // Render Layer Card
    const LayerCard = ({ layer }) => {
        const isPumpOn = layer.pumpInfo.status;
        
        return (
            <div className="relative overflow-hidden rounded-[2rem] h-[180px] group shadow-xl transition-all hover:scale-[1.01]">
                {/* Background Image/Gradient */}
                <div className="absolute inset-0 bg-[#0f281e]">
                     <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 to-transparent z-10" />
                     {/* Subtle abstract texture or simple dark bg */}
                     <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('/vertical_farm_background_lush.png')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                </div>

                <div className="relative z-20 p-6 h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl backdrop-blur-md border border-emerald-500/30">
                            <Droplets size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg leading-tight">{layer.name}</h3>
                            <p className="text-emerald-200/60 text-xs uppercase tracking-wider">Layer {layer.id}</p>
                        </div>
                    </div>

                    {/* Stats & Controls Row */}
                    <div className="flex items-end justify-between gap-4 mt-4">
                        
                        {/* Moisture Progress */}
                        <div className="flex-1 max-w-[50%]">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-emerald-100/80 font-medium">Soil Moisture</span>
                                <span className="text-white font-bold">{layer.moisture}%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${layer.moisture}%` }}
                                    transition={{ duration: 1 }}
                                    className={`h-full rounded-full ${
                                        layer.moisture < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-green-300'
                                    }`} 
                                />
                            </div>
                            {/* Auto Mode Tag */}
                             <div className="mt-2">
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                                    AUTO MODE
                                </span>
                             </div>
                        </div>

                        {/* Pump Controls */}
                        <div className="flex items-center gap-3">
                             <div className="hidden sm:block">
                                  {/* Pump Illustration (CSS or Image) */}
                                  <div className={`w-12 h-12 relative transition-all ${isPumpOn ? 'animate-pulse' : 'opacity-50 grayscale'}`}>
                                      <img src="/pump-icon.svg" className="w-full h-full" alt="Pump" onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY3lsaW5kZXIiPjxlbGxpcHNlIGN4PSIxMiIgY3k9IjUiIHJ4PSI5IiByeT0iMyIvPjxwYXRoIGQ9Ik0zIDV2MTRjMCAxLjY2IDQgMyA5IDNzOS0xLjM0IDktM1Y1Ii8+PC9zdmc+"
                                      }}/>
                                  </div>
                             </div>
                             
                             <div className="flex flex-col gap-2">
                                <div className="px-3 py-1 bg-white/10 rounded backdrop-blur text-xs text-white font-mono text-center border border-white/10">
                                    Motor {layer.id} <span className={isPumpOn ? 'text-green-400' : 'text-slate-400'}>{isPumpOn ? 'ON' : 'OFF'}</span>
                                </div>
                                <button
                                    onClick={() => togglePump(layer.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                                        isPumpOn 
                                            ? 'bg-red-500/90 hover:bg-red-600 border border-red-400/50' 
                                            : 'bg-emerald-600/90 hover:bg-emerald-700 border border-emerald-400/50'
                                    }`}
                                >
                                    <Droplets size={12} className="fill-current" />
                                    {isPumpOn ? 'Turn OFF Pump' : 'Turn ON Pump'}
                                </button>
                             </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-[#f1f5f9] pt-24 pb-12 px-4 lg:px-8 font-sans">
             <div className="max-w-[1400px] mx-auto">
                
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <Activity size={14} /> <span>Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1e293b]">
                        AIoT Smart Vertical Farming <span className="text-[#688557]">Dashboard</span>
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Welcome, {user?.name || 'Farmer'}! Monitor and manage your smart vertical farm efficiently.
                    </p>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        icon={Thermometer} 
                        label="Avg. Temperature" 
                        value={`${overallStats.avgTemp}°C`} 
                        color="orange" 
                        bgColor="bg-orange-50"
                        iconBg="bg-orange-100"
                        iconColor="text-orange-500"
                    />
                    <StatCard 
                        icon={Droplets} 
                        label="Avg. Humidity" 
                        value={`${overallStats.avgHumidity}%`} 
                        color="blue" 
                         bgColor="bg-blue-50"
                        iconBg="bg-blue-100"
                        iconColor="text-blue-500"
                    />
                     <StatCard 
                        icon={Wind} 
                        label="Air Quality" 
                        value={overallStats.airQuality} 
                        color="green" 
                         bgColor="bg-green-50"
                        iconBg="bg-green-100"
                        iconColor="text-green-600"
                    />
                     <StatCard 
                        icon={CloudFog} 
                        label="CO2 Level" 
                        value={`${overallStats.co2} ppm`} 
                        color="teal" 
                         bgColor="bg-teal-50"
                        iconBg="bg-teal-100"
                        iconColor="text-teal-600"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    
                    {/* Left Column: Layers (Cards) */}
                    <div className="xl:col-span-8 space-y-6">
                        {Object.values(layers).map((layer) => (
                            <LayerCard key={layer.id} layer={layer} />
                        ))}
                    </div>

                    {/* Right Column: Sidebar (Tower & Overview) */}
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        


                        {/* Overview Stats Card */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
                             <h3 className="text-lg font-bold text-slate-800 mb-6">Overview</h3>
                             
                             {/* Mini Chart */}
                             <div className="h-32 w-full mb-6">
                                 <div className="flex justify-between items-end mb-2 px-1">
                                     <span className="text-xs text-slate-400">Average CO2 Level</span>
                                     <span className="text-sm font-bold text-slate-700">435 <span className="text-[10px] text-slate-400">ppm</span></span>
                                 </div>
                                 <ResponsiveContainer width="100%" height="100%">
                                     <AreaChart data={[
                                         {name: 'Mon', val: 400}, {name: 'Tue', val: 420}, {name: 'Wed', val: 410}, 
                                         {name: 'Thu', val: 440}, {name: 'Fri', val: 435}, {name: 'Sat', val: 450}
                                     ]}>
                                         <defs>
                                             <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                             </linearGradient>
                                         </defs>
                                         <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorCo2)" strokeWidth={2} />
                                     </AreaChart>
                                 </ResponsiveContainer>
                             </div>

                             {/* Usage Stats List */}
                             <div className="space-y-4">
                                 <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                                     <div className="p-2 bg-blue-100 rounded-lg text-blue-500">
                                         <Droplets size={16} />
                                     </div>
                                     <div>
                                         <p className="text-xs text-slate-500 font-medium">Overall Water Usage</p>
                                         <p className="text-sm font-bold text-slate-800">34.2 L</p>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                                     <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
                                         <Zap size={16} />
                                     </div>
                                     <div>
                                         <p className="text-xs text-slate-500 font-medium">Overall Pump Usage</p>
                                         <p className="text-sm font-bold text-slate-800">18.4 hrs</p>
                                     </div>
                                 </div>
                             </div>

                             {/* ML Predictions Button */}
                             <div className="mt-6 pt-6 border-t border-slate-100">
                                 <div className="flex items-center justify-between mb-3">
                                     <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                         <Activity size={16} className="text-[#688557]" /> ML Predictions
                                     </h4>
                                     <ChevronRight size={16} className="text-slate-400" />
                                 </div>
                                 <button 
                                    onClick={() => navigate('/predictions')}
                                    className="w-full py-3 bg-[#3e5233] hover:bg-[#2d3b25] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/10 transition-all flex items-center justify-center gap-2"
                                 >
                                     View Predictions <ChevronRight size={14} />
                                 </button>
                             </div>
                        </div>

                    </div>
                </div>
             </div>
        </main>
    );
};

const StatCard = ({ icon: Icon, label, value, bgColor, iconBg, iconColor }) => (
    <div className={`p-5 rounded-2xl ${bgColor} border border-white/50 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1`}>
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">{value}</p>
        </div>
    </div>
);

export default Dashboard;
