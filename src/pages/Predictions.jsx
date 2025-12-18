import React, { useState, useEffect } from 'react';
import { Brain, Droplets, Sprout, Activity, Zap, Timer, Bot, Scan, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const PredictionCard = ({ title, value, subtext, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 p-3 opacity-10 ${color}`}>
      <Icon size={100} />
    </div>
    <div className="relative z-10">
      <div className={`p-3 rounded-lg inline-flex mb-4 ${color.replace('text-', 'bg-').replace('500', '500/20')} ${color}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
        <Activity size={12} /> {subtext}
      </p>
    </div>
  </motion.div>
);

const FeatureCard = ({ title, description, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="group p-6 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 hover:border-farm-accent/50 transition-all duration-300"
  >
    <div className="mb-4 p-4 rounded-full bg-slate-800 border border-slate-700 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
      <Icon className="text-farm-accent group-hover:text-white" size={32} />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const MLPredictions = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const runUseAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setLastUpdated(new Date());
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 p-6 pt-24 lg:px-12 max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-12 text-center max-w-3xl mx-auto">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-farm-accent/10 border border-farm-accent/20 text-farm-accent text-sm font-medium mb-4"
                >
                    <Brain size={16} /> AIoT-Driven Intelligence
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Smart Crop <span className="text-transparent bg-clip-text bg-gradient-to-r from-farm-accent to-blue-500">Prediction Engine</span>
                </h1>
                <p className="text-slate-400 text-lg">
                    Leveraging Machine Learning to analyze real-time soil data, optimize irrigation cycles, and ensure resource sustainability with autonomous control.
                </p>
            </div>

            {/* Live Predictions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <PredictionCard 
                    title="Next Irrigation" 
                    value="45 mins" 
                    subtext="Based on moisture loss rate"
                    icon={Droplets}
                    color="text-blue-500"
                />
                <PredictionCard 
                    title="Pump Efficiency" 
                    value="94.2%" 
                    subtext="+15% vs manual control"
                    icon={Zap}
                    color="text-yellow-500"
                />
                <PredictionCard 
                    title="Growth Rate" 
                    value="Optimal" 
                    subtext="Matching expected biological curve"
                    icon={Sprout}
                    color="text-emerald-500"
                />
                <PredictionCard 
                    title="Prediction Confidence" 
                    value="98.5%" 
                    subtext="Model: Gradient Boosting (v2.1)"
                    icon={Brain}
                    color="text-purple-500"
                />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                
                {/* AI Control Logic Visualization */}
                <div className="lg:col-span-2 bg-slate-800/50 rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Autonomous Decision Logic</h2>
                        <button 
                            onClick={runUseAnalysis}
                            disabled={analyzing}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            {analyzing ? <Activity className="animate-spin" size={16}/> : <Scan size={16}/>}
                            {analyzing ? 'Analyzing...' : 'Run Diagnostics'}
                        </button>
                    </div>

                    <div className="relative">
                        {/* Flowchart Visualization */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                            
                            <div className={`p-4 rounded-xl border-2 ${analyzing ? 'border-farm-accent animate-pulse' : 'border-slate-600'} bg-slate-900 w-full md:w-1/4`}>
                                <div className="text-farm-accent mb-2 flex justify-center"><Target /></div>
                                <h4 className="font-bold text-white">Input</h4>
                                <p className="text-xs text-slate-400">Sensor Data (Moisture, Temp)</p>
                            </div>

                            <div className="hidden md:block h-0.5 w-12 bg-slate-600"></div>

                            <div className={`p-4 rounded-xl border-2 ${analyzing ? 'border-purple-500 animate-pulse' : 'border-slate-600'} bg-slate-900 w-full md:w-1/4`}>
                                <div className="text-purple-500 mb-2 flex justify-center"><Brain /></div>
                                <h4 className="font-bold text-white">Process</h4>
                                <p className="text-xs text-slate-400">ML Algorithm & Thresholds</p>
                            </div>

                            <div className="hidden md:block h-0.5 w-12 bg-slate-600"></div>

                            <div className={`p-4 rounded-xl border-2 ${analyzing ? 'border-blue-500 animate-pulse' : 'border-slate-600'} bg-slate-900 w-full md:w-1/4`}>
                                <div className="text-blue-500 mb-2 flex justify-center"><Zap /></div>
                                <h4 className="font-bold text-white">Action</h4>
                                <p className="text-xs text-slate-400">Pump Actuation (ON/OFF)</p>
                            </div>

                        </div>
                        
                        <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                             <p className="font-mono text-xs text-green-400">
                                 • System Status: ACTIVE_MONITORING<br/>
                                 • Last Inference: {lastUpdated.toLocaleTimeString()}<br/>
                                 • Decision: MAINTAIN_CURRENT_STATE (Moisture levels adequate)<br/>
                                 • Resource Saving: Water usage reduced by 2.5L today.
                             </p>
                        </div>
                    </div>
                </div>

                {/* System Specs Sidebar */}
                <div className="bg-gradient-to-br from-farm-card to-slate-900 rounded-3xl p-8 border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">System Architecture</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Bot /></div>
                            <div>
                                <h4 className="font-semibold text-white">Training Model</h4>
                                <p className="text-sm text-slate-400">Random Forest Regressor trained on 10k+ sensor data points.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400"><Timer /></div>
                            <div>
                                <h4 className="font-semibold text-white">Latency</h4>
                                <p className="text-sm text-slate-400">Real-time processing with &lt;200ms sensor-to-action delay.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Activity /></div>
                            <div>
                                <h4 className="font-semibold text-white">Scalability</h4>
                                <p className="text-sm text-slate-400">Single vertical pole architecture supporting multiple soil types.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Future Roadmap Section */}
            <div className="border-t border-slate-800 pt-16">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Future Enhancements</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard 
                        title="Computer Vision" 
                        description="Integration of image processing to detect unwanted plants (weeds) and diseases early."
                        icon={Scan}
                        delay={0.1}
                    />
                    <FeatureCard 
                        title="Robotic Harvesting" 
                        description="Automated robotic arms for precise harvesting, reducing labor costs and human error."
                        icon={Bot}
                        delay={0.2}
                    />
                    <FeatureCard 
                        title="Drone Spraying" 
                        description="Autonomous drone systems for targeted pesticide application based on AI analysis."
                        icon={Target}
                        delay={0.3}
                    />
                </div>
            </div>

        </div>
    );
};

export default MLPredictions;
