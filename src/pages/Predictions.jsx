import React, { useState } from 'react';
import { Brain, Droplets, Sprout, Activity, Zap, Timer, Bot, Scan, Target, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const PredictionCard = ({ title, value, subtext, icon: Icon, color, trend }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-[0.03] transform group-hover:scale-110 transition-transform duration-500`}>
      <Icon size={120} className="text-slate-900" />
    </div>
    
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      
      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{title}</h3>
      <div className="flex items-end gap-2 mt-1">
          <p className="text-3xl font-extrabold text-slate-800">{value}</p>
          {trend && (
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md mb-1.5 flex items-center">
                  <TrendingUp size={10} className="mr-0.5" /> {trend}
              </span>
          )}
      </div>
      <p className="text-xs text-slate-400 mt-3 font-medium flex items-center gap-1.5">
        <Activity size={12} /> {subtext}
      </p>
    </div>
  </motion.div>
);

const MLPredictions = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [activeTab, setActiveTab] = useState('yield');

    const runAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => setAnalyzing(false), 2500);
    };

    const yieldData = [
        { name: 'Week 1', val: 4000 },
        { name: 'Week 2', val: 3000 },
        { name: 'Week 3', val: 5000 },
        { name: 'Week 4', val: 4500 },
        { name: 'Week 5', val: 6000 },
        { name: 'Week 6', val: 5500 },
        { name: 'Week 7', val: 6500 },
    ];

    return (
        <div className="min-h-screen bg-[#f1f5f9] text-slate-900 pt-24 pb-12 px-4 lg:px-8 font-sans">
            <div className="max-w-[1400px] mx-auto">
                
                {/* Header */}
                <div className="mb-10 text-center max-w-2xl mx-auto">
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#688557]/10 border border-[#688557]/20 text-[#688557] text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <Brain size={14} /> AIoT Intelligence Engine
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                        Smart Crop <span className="text-[#688557]">Predictions</span>
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Real-time machine learning insights to optimize your vertical farm's yield, resource usage, and harvest timing.
                    </p>
                </div>

                {/* Top Prediction Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <PredictionCard 
                        title="Projected Yield" 
                        value="125 kg" 
                        subtext="Expected harvest in 5 days"
                        icon={Sprout}
                        color="bg-emerald-500"
                        trend="+12%"
                    />
                    <PredictionCard 
                        title="Water Savings" 
                        value="3,240 L" 
                        subtext="Projected monthly saving"
                        icon={Droplets}
                        color="bg-blue-500"
                        trend="+8%"
                    />
                    <PredictionCard 
                        title="Energy Efficiency" 
                        value="94.2%" 
                        subtext="Optimized LED schedules"
                        icon={Zap}
                        color="bg-yellow-500"
                    />
                     <PredictionCard 
                        title="Model Accuracy" 
                        value="98.5%" 
                        subtext="Random Forest Regressor v2.1"
                        icon={Brain}
                        color="bg-purple-500"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Col: Analysis Charts */}
                    <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Growth Analysis</h3>
                                <p className="text-slate-400 text-sm">Predicted vs Actual performance metrics</p>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                {['yield', 'resources', 'health'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                                            activeTab === tab 
                                                ? 'bg-white text-[#688557] shadow-sm' 
                                                : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={yieldData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#688557" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#688557" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#688557', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="val" stroke="#688557" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Col: AI Logic & Actions */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        
                        {/* Logic Visualizer */}
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                             {/* Background Circuit Pattern */}
                             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                             
                             <div className="relative z-10">
                                 <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                     <Scan className="text-[#688557]" /> Autonomous Logic
                                 </h3>

                                 <div className="space-y-6 relative">
                                     {/* Connecting Line */}
                                     <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-700"></div>

                                     <div className="relative pl-10">
                                         <div className="absolute left-2.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-slate-900"></div>
                                         <h4 className="text-sm font-bold text-blue-400">Input Processing</h4>
                                         <p className="text-xs text-slate-400 mt-1">Analyzing moisture levels from 12 sensors.</p>
                                     </div>

                                     <div className="relative pl-10">
                                         <div className={`absolute left-2.5 top-1.5 w-3 h-3 bg-purple-500 rounded-full ring-4 ring-slate-900 ${analyzing ? 'animate-ping' : ''}`}></div>
                                         <h4 className="text-sm font-bold text-purple-400">Inference</h4>
                                         <p className="text-xs text-slate-400 mt-1">Comparing against optimal growth curves.</p>
                                     </div>

                                     <div className="relative pl-10">
                                         <div className="absolute left-2.5 top-1.5 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-slate-900"></div>
                                         <h4 className="text-sm font-bold text-emerald-400">Decision</h4>
                                         <p className="text-xs text-slate-400 mt-1">Recommendation: Increase nutrient flow by 5%.</p>
                                     </div>
                                 </div>

                                 <button 
                                    onClick={runAnalysis}
                                    disabled={analyzing}
                                    className="w-full mt-8 py-3 bg-[#688557] hover:bg-[#5a744b] rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     {analyzing ? <Activity size={16} className="animate-spin" /> : <Zap size={16} />}
                                     {analyzing ? 'Running Analysis...' : 'Run New Diagnostics'}
                                 </button>
                             </div>
                        </div>

                         {/* Quick Actions */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
                            <h3 className="text-md font-bold text-slate-800 mb-4">Optimization Suggestions</h3>
                            <div className="space-y-3">
                                <button className="w-full p-4 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 text-left transition-colors group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-orange-600 uppercase">Harvesting</span>
                                        <ChevronRight size={16} className="text-orange-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Schedule partial harvest for Layer 2 next Tuesday.</p>
                                </button>
                                <button className="w-full p-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-left transition-colors group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-blue-600 uppercase">Irrigation</span>
                                        <ChevronRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Reduce water cycle duration by 10 mins.</p>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MLPredictions;
