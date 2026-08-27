import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Wind, Zap, Activity, ChevronRight, Sun, Gauge, Clock, BarChart3, Brain, CloudRain, TrendingUp, PhoneCall, Receipt, Camera, Leaf as LeafIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import SensorGraphs from '../components/SensorGraphs';

const Dashboard = () => {
    const { user } = useAuth();
    const { layers, isConnected, togglePump, lastUpdated, isDemoMode } = useFarm();
    const navigate = useNavigate();
    const [selectedZoneForGraph, setSelectedZoneForGraph] = useState(null);
    const sensorGraphsRef = useRef(null);
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const API_KEY = import.meta.env.VITE_ACCUWEATHER_API_KEY || "YOUR_API_KEY_HERE";
                const LOCATION_KEY = "186818"; // Ongole
                const url = `https://dataservice.accuweather.com/currentconditions/v1/${LOCATION_KEY}?apikey=${API_KEY}&details=true`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data && data.length > 0) {
                    const current = data[0];
                    const currentData = {
                        temperature_2m: current.Temperature?.Metric?.Value || 0,
                        relative_humidity_2m: current.RelativeHumidity || 0,
                        wind_speed_10m: current.Wind?.Speed?.Metric?.Value || 0,
                        rain: current.Precip1hr?.Metric?.Value || 0,
                        is_day: current.IsDayTime,
                    };
                    setWeatherData(currentData);
                }
            } catch (error) {
                console.error("Failed to fetch weather data", error);
            } finally {
                setWeatherLoading(false);
            }
        };
        fetchWeather();
    }, []);

    useEffect(() => {
        if (selectedZoneForGraph && sensorGraphsRef.current) {
            sensorGraphsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedZoneForGraph]);

    const getZoneKey = (zone) => {
        const zoneIdStr = zone.id != null ? String(zone.id) : '';
        const zoneNameStr = zone.name ? String(zone.name) : '';
        const zoneId = (zoneIdStr || zoneNameStr).toLowerCase();
        
        if (typeof zone.id === 'number' && zone.id >= 1 && zone.id <= 3) {
            return `zone${zone.id}`;
        }
        if (zoneId.includes('1') || zoneId.includes('zone1') || zoneId.includes('one')) return 'zone1';
        if (zoneId.includes('2') || zoneId.includes('zone2') || zoneId.includes('two')) return 'zone2';
        if (zoneId.includes('3') || zoneId.includes('zone3') || zoneId.includes('three')) return 'zone3';
        
        const match = zoneId.match(/\d+/);
        if (match) {
            const num = parseInt(match[0], 10);
            if (num >= 1 && num <= 3) return `zone${num}`;
        }
        return 'zone1';
    };

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

    const ZoneCard = ({ zone }) => {
        const isPumpOn = isConnected && zone.pumpInfo.status;
        const motorStatus = isConnected ? (zone.motor || (isPumpOn ? 'ON' : 'OFF')) : 'OFF';
        const isMotorActive = isConnected && motorStatus === 'ON';
        const zoneKey = getZoneKey(zone);
        
        const tempDisplay = isConnected ? `${zone.temperature}°C` : '--';
        const humDisplay = isConnected ? `${zone.humidity}%` : '--';
        const soilDisplay = isConnected ? `${zone.moisture}` : '--';
        const gasDisplay = isConnected ? `${zone.gas}` : '--';
        const lightDisplay = isConnected ? `${zone.light} Lx` : '-- Lx';

        const handleZoneClick = (e) => {
            if (e.target.closest('button')) return;
            setSelectedZoneForGraph(zoneKey);
        };
        
        return (
            <div 
                onClick={handleZoneClick}
                className="bg-white rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer card-premium animate-glow-border"
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{zone.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">ID: {zone.id}</span>
                            <span className="text-gray-300">•</span>
                            <span className={`text-xs font-semibold ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
                                {isConnected ? 'Live Data' : 'Offline'}
                            </span>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold border flex items-center gap-1.5 ${
                        isMotorActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${isMotorActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        PUMP {motorStatus}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                     <SensorBadge icon={Thermometer} label="Temp" value={tempDisplay} />
                     <SensorBadge icon={Droplets} label="Humidity" value={humDisplay} />
                     <SensorBadge icon={Gauge} label="Soil" value={soilDisplay} />
                     <SensorBadge icon={Wind} label="Gas" value={gasDisplay} />
                </div>
                
                <div className="mb-5">
                     <div className="flex justify-between items-center mb-1.5">
                         <span className="text-xs font-medium text-gray-500">Light Intensity</span>
                         <span className="text-xs font-bold text-gray-900">{lightDisplay}</span>
                     </div>
                     <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div 
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: isConnected ? `${Math.min(100, (zone.light / 1000) * 100)}%` : '0%' }} 
                         />
                     </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        Status: <span className={isMotorActive ? "text-green-600 font-semibold" : "text-gray-700 font-semibold"}>
                            {!isConnected ? 'Offline' : isMotorActive ? 'Watering Active' : 'Standby'}
                        </span>
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePump(zone.id);
                        }}
                        className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors border ${
                            isMotorActive 
                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                                : 'bg-[#1F3B21] text-white border-[#1F3B21] hover:bg-[#152a17]'
                        }`}
                    >
                        {isMotorActive ? 'Stop Pump' : 'Start Pump'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-transparent pt-28 pb-16 px-6 lg:px-12">
             <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                            Infrastructure Overview
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Monitoring {Object.keys(layers).length} Active Zones
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {isDemoMode && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded border border-yellow-200">
                                DEMO MODE
                            </span>
                        )}
                        <div className="flex items-center gap-2 text-gray-500 text-sm bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm">
                            <Clock size={14} />
                            <span>Updated: <span className="text-gray-900 font-medium">
                                {lastUpdated ? (lastUpdated.includes(',') ? lastUpdated : `Today, ${lastUpdated}`) : 'Syncing...'}
                            </span></span>
                        </div>
                    </div>
                </div>

                {/* Weather Parameters Top Section */}
                <div className="bg-white rounded-xl p-6 mb-8 flex items-center justify-between shadow-md card-premium animate-glow-border">
                    <div className="flex items-center gap-3">
                        <CloudRain className="text-blue-500" size={28} />
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Current Weather in Ongole</h2>
                            <p className="text-sm text-gray-500">Live parameters</p>
                        </div>
                    </div>
                    {weatherLoading ? (
                        <div className="text-sm text-gray-500">Loading parameters...</div>
                    ) : weatherData ? (
                        <div className="flex gap-8">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-semibold uppercase">Temp</span>
                                <span className="text-lg font-bold text-gray-900">{weatherData.temperature_2m.toFixed(1)}°C</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-semibold uppercase">Humidity</span>
                                <span className="text-lg font-bold text-gray-900">{weatherData.relative_humidity_2m.toFixed(1)}%</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-semibold uppercase">Wind</span>
                                <span className="text-lg font-bold text-gray-900">{weatherData.wind_speed_10m.toFixed(1)} km/h</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-semibold uppercase">Rain</span>
                                <span className="text-lg font-bold text-gray-900">{weatherData.rain.toFixed(1)} mm</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 font-semibold uppercase">Time</span>
                                <span className="text-lg font-bold text-gray-900">{weatherData.is_day ? 'Day' : 'Night'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">Failed to load data</div>
                    )}
                </div>

                {/* Overall Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard 
                        icon={Gauge} 
                        label="Soil Moisture" 
                        value="45%" 
                    />
                    <StatCard 
                        icon={Thermometer} 
                        label="Temperature" 
                        value={`${overallStats.avgTemp}°C`} 
                    />
                     <StatCard 
                        icon={Zap} 
                        label="Energy Usage" 
                        value="24.5 kWh" 
                    />
                     <StatCard 
                        icon={AlertTriangle} 
                        label="Active Alerts" 
                        value="2" 
                        valueColor="text-agri-alert"
                    />
                </div>

                {/* Main Zone Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Active Zones</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.values(layers).map((layer) => (
                                <ZoneCard key={layer.id} zone={layer} />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* ML Prediction */}
                        <div className="bg-agri-dark rounded-xl p-5 animate-glow-border-dark shimmer-overlay">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Brain size={18} className="text-agri-gold" /> AI Predictions
                                </h3>
                                <span className="px-2 py-1 bg-agri-success/20 text-agri-success border border-agri-success/30 text-xs font-bold rounded flex items-center gap-1">
                                    <CheckCircle2 size={12} /> High Confidence
                                </span>
                             </div>
                             <p className="text-gray-300 text-sm mb-4">
                                Our ML models analyze historical yield, weather, and soil data to forecast your harvest 30 days in advance.
                             </p>
                             <button onClick={() => navigate('/predictions')} className="text-agri-gold text-sm font-bold flex items-center gap-1 hover:underline">View Forecast <ChevronRight size={16}/></button>
                        </div>

                        {/* Leaf Detection */}
                        <div className="bg-white rounded-xl p-5 card-premium animate-glow-border">
                             <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                <Camera size={18} className="text-agri-gold" /> Leaf Detection
                             </h3>
                             <p className="text-gray-600 text-sm mb-4">
                                Upload a photo of any leaf. Our vision model detects disease, nutrient deficiency, or pest damage in seconds.
                             </p>
                             <div className="flex gap-2 mb-4">
                                <span className="px-2 py-1 bg-agri-alert/10 text-agri-alert text-xs font-bold rounded">Issues Detected</span>
                                <span className="px-2 py-1 bg-agri-success/10 text-agri-success text-xs font-bold rounded">Healthy</span>
                             </div>
                             <button onClick={() => navigate('/image-detection')} className="text-agri-dark text-sm font-bold flex items-center gap-1 hover:underline">Scan Leaf <ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>
                
                {/* Secondary Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {/* Satellite Weather */}
                    <div className="bg-agri-light/50 rounded-xl p-5 card-premium animate-glow-subtle">
                        <CloudRain size={24} className="text-blue-500 mb-3" />
                        <h3 className="font-bold text-gray-900 mb-2">Weather Forecast</h3>
                        <p className="text-gray-600 text-sm">
                            Live satellite data forecasts rainfall, humidity, and temperature for your exact field location — 7-day outlook.
                        </p>
                    </div>

                    {/* Market Prediction */}
                    <div className="bg-agri-dark rounded-xl p-5 animate-glow-border-dark shimmer-overlay">
                        <div className="flex justify-between mb-3">
                            <TrendingUp size={24} className="text-agri-gold" />
                            <div className="flex items-end gap-1">
                                <span className="text-agri-gold font-bold">+5.2%</span>
                                <TrendingUp size={14} className="text-agri-gold mb-1" />
                            </div>
                        </div>
                        <h3 className="font-bold text-white mb-2">Market Prediction</h3>
                        <p className="text-gray-300 text-sm">
                            Track real-time crop prices and get AI-predicted price trends so you know the best time to sell.
                        </p>
                    </div>

                    {/* Customer Support */}
                    <div className="bg-white rounded-xl p-5 card-premium animate-glow-subtle">
                        <div className="flex gap-2 mb-3">
                            <PhoneCall size={20} className="text-agri-gold" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Customer Support</h3>
                        <p className="text-gray-600 text-sm mb-3">
                            Have a question? Our team responds within 24 hours.
                        </p>
                        <button onClick={() => navigate('/contact')} className="text-agri-dark text-sm font-bold flex items-center gap-1 hover:underline">Contact Us <ChevronRight size={16}/></button>
                    </div>

                    {/* Billing */}
                    <div className="bg-white rounded-xl p-5 card-premium animate-glow-subtle">
                        <Receipt size={24} className="text-agri-gold mb-3" />
                        <h3 className="font-bold text-gray-900 mb-2">Service Bill</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Your monthly usage summary — sensors, API calls, and support, billed transparently.
                        </p>
                        <div className="space-y-2 text-sm font-bold">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-gray-600">Previous</span>
                                <span className="text-agri-success font-black">Paid</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-gray-900">Current</span>
                                <span className="text-agri-alert font-black">Due: $45.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sensor Graphs */}
                <div ref={sensorGraphsRef} className="mt-12 bg-white rounded-xl p-6 card-premium animate-glow-border">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Historical Sensor Analytics</h2>
                    <SensorGraphs initialZone={selectedZoneForGraph} />
                </div>
             </div>
        </main>
    );
};

const SensorBadge = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-50 rounded-lg p-2.5 animate-glow-subtle">
        <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Icon size={14} />
            <span className="text-[10px] uppercase font-bold">{label}</span>
        </div>
        <div className="text-sm font-bold text-gray-900">{value}</div>
    </div>
);

const StatCard = ({ icon: Icon, label, value, valueColor = "text-agri-gold" }) => (
    <div className="bg-white rounded-xl p-5 flex items-center gap-4 card-premium animate-glow-border animate-pulse-glow">
        <div className="p-3 bg-agri-dark rounded-lg text-white">
            <Icon size={24} />
        </div>
        <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 bg-agri-dark text-white px-2 py-0.5 rounded-sm inline-block">{label}</div>
            <h4 className={`text-3xl font-black ${valueColor}`}>{value}</h4>
        </div>
    </div>
);

export default Dashboard;
