import React from 'react';
import { useFarm } from '../context/FarmContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-400 text-xs mb-2">{new Date(label).toLocaleTimeString()}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-white">{entry.name}:</span>
            <span className="font-mono text-white">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MoistureChart = () => {
  const { history } = useFarm();
  
  // Format history for chart if needed, but Recharts handles array of objects well.

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
         <div className="h-6 w-1 bg-purple-500 rounded-full"/>
         Moisture Trends
      </h2>
      
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={history}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorL1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorL2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorL3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
            <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                tick={{ fontSize: 12 }}
                tickMargin={10}
            />
            <YAxis 
                stroke="#94a3b8" 
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            <Area 
                type="monotone" 
                dataKey="layer1_moisture" 
                name="Top Layer" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorL1)" 
                strokeWidth={2}
                animationDuration={1000}
            />
            <Area 
                type="monotone" 
                dataKey="layer2_moisture" 
                name="Middle Layer" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorL2)" 
                strokeWidth={2}
                animationDuration={1000}
            />
            <Area 
                type="monotone" 
                dataKey="layer3_moisture" 
                name="Bottom Layer" 
                stroke="#f59e0b" 
                fillOpacity={1} 
                fill="url(#colorL3)" 
                strokeWidth={2}
                animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoistureChart;
