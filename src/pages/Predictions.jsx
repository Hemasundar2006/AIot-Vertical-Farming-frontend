import React, { useState, useEffect } from 'react';
import { Brain, Droplets, Sprout, Activity, Zap, Timer, Bot, Scan, Target, ChevronRight, TrendingUp, Calendar, Sun, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { Client } from '@gradio/client';

const API_BASE_URL = 'https://aiot-vertical-farming-backend.onrender.com';

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
    
    // Crop prediction states
    const [year, setYear] = useState(2025);
    const [season, setSeason] = useState("Kharif");
    const [month, setMonth] = useState("January");
    const [soilType, setSoilType] = useState("Clay");
    const [predictedCrop, setPredictedCrop] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    
    // Water prediction states
    const [waterCrop, setWaterCrop] = useState("Lettuce");
    const [waterSoil, setWaterSoil] = useState("Clay");
    const [waterMonth, setWaterMonth] = useState("January");
    const [waterSeason, setWaterSeason] = useState("Summer");
    const [waterYear, setWaterYear] = useState(2025);
    const [waterTemperature, setWaterTemperature] = useState(25);
    const [waterPrediction, setWaterPrediction] = useState(null);
    const [isPredictingWater, setIsPredictingWater] = useState(false);
    
    // Options from backend
    const [seasons, setSeasons] = useState(["Kharif", "Rabi", "Zaid"]);
    const [months, setMonths] = useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    const [soilTypes, setSoilTypes] = useState(["Clay", "Sandy", "Loamy", "Silt", "Peaty", "Chalky"]);
    const [yearRange, setYearRange] = useState({ min: 2020, max: 2030 });
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    // Fetch options from backend
    useEffect(() => {
        const fetchOptions = async () => {
            setIsLoadingOptions(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/crop/options`);
                if (!response.ok) {
                    throw new Error('Failed to fetch options');
                }
                const data = await response.json();
                
                if (data.seasons) setSeasons(data.seasons);
                if (data.months) setMonths(data.months);
                if (data.soil_types) setSoilTypes(data.soil_types);
                if (data.year_range) {
                    setYearRange(data.year_range);
                    // Set default year if available
                    if (data.year_range.min) {
                        setYear(data.year_range.min);
                    }
                }
                
                // Set default values from options if available
                if (data.seasons && data.seasons.length > 0) {
                    setSeason(data.seasons[0]);
                }
                if (data.months && data.months.length > 0) {
                    setMonth(data.months[0]);
                }
                if (data.soil_types && data.soil_types.length > 0) {
                    setSoilType(data.soil_types[0]);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
                // Keep default values if fetch fails
                toast.error('Failed to load options. Using default values.');
            } finally {
                setIsLoadingOptions(false);
            }
        };
        
        fetchOptions();
    }, []);

    const handleCropPrediction = async () => {
        setIsPredicting(true);
        setPredictedCrop(null);
        
        try {
            console.log("Calling API with parameters:", { year, season, month, soil_type: soilType });
            
            const response = await fetch(`${API_BASE_URL}/api/crop/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    year: year,
                    season: season,
                    month: month,
                    soil_type: soilType,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data);
            
            // Extract crop from response
            const crop = data.prediction;
            
            if (!crop) {
                throw new Error("No prediction found in API response. Response: " + JSON.stringify(data));
            }

            console.log("Predicted Crop:", crop);
            setPredictedCrop(crop);
            toast.success("Crop prediction successful!");
        } catch (error) {
            console.error("Prediction error:", error);
            const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
            toast.error(`Failed to predict crop: ${errorMessage}`);
        } finally {
            setIsPredicting(false);
        }
    };

    const runAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => setAnalyzing(false), 2500);
    };

    // Water prediction handler using Gradio client
    const handleWaterPrediction = async () => {
        setIsPredictingWater(true);
        setWaterPrediction(null);
        
        try {
            // Validate inputs
            if (!waterCrop || !waterSoil || !waterMonth || !waterSeason || !waterYear || !waterTemperature) {
                throw new Error("Please fill in all fields");
            }
            
            if (waterYear < 2000 || waterYear > 2100) {
                throw new Error("Year must be between 2000 and 2100");
            }
            
            const validTemperatures = [18, 20, 22, 25, 28, 30, 32, 35];
            if (!validTemperatures.includes(waterTemperature)) {
                throw new Error("Temperature must be one of: 18, 20, 22, 25, 28, 30, 32, 35");
            }
            
            console.log("Connecting to Gradio client: sumiyon/water_only");
            
            // Connect to Gradio client
            const client = await Client.connect("sumiyon/water_only");
            
            console.log("Calling predict_water with parameters:", {
                crop: waterCrop,
                soil: waterSoil,
                month: waterMonth,
                season: waterSeason,
                year: String(waterYear),
                temperature: String(waterTemperature),
            });
            
            // Call the Gradio API
            const result = await client.predict("/predict_water", {
                crop: waterCrop,
                soil: waterSoil,
                month: waterMonth,
                season: waterSeason,
                year: String(waterYear),
                temperature: String(waterTemperature),
            });

            console.log("Water Prediction Response:", result.data);
            
            // Gradio returns data as an array, first element is the prediction string
            const predictionText = result.data && result.data[0] ? result.data[0] : null;
            
            if (predictionText) {
                setWaterPrediction({
                    prediction: predictionText,
                    input: {
                        crop: waterCrop,
                        soil: waterSoil,
                        month: waterMonth,
                        season: waterSeason,
                        year: String(waterYear),
                        temperature: String(waterTemperature),
                    }
                });
                toast.success("Water prediction generated successfully!");
            } else {
                throw new Error("No prediction returned from API. Response: " + JSON.stringify(result));
            }
        } catch (error) {
            console.error("Water prediction error:", error);
            let errorMessage = "Unknown error occurred";
            
            if (error.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error.toString) {
                errorMessage = error.toString();
            }
            
            // Provide more helpful error messages
            if (errorMessage.includes('connect') || errorMessage.includes('network')) {
                errorMessage = "Network error: Could not connect to prediction service. Please check your connection.";
            } else if (errorMessage.includes('timeout')) {
                errorMessage = "Request timed out. Please try again.";
            }
            
            toast.error(`Failed to predict water: ${errorMessage}`);
        } finally {
            setIsPredictingWater(false);
        }
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

                {/* Crop Prediction Form Section */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 mb-10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#688557]/10 flex items-center justify-center">
                            <Sprout className="text-[#688557]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">Crop Prediction</h2>
                            <p className="text-slate-500 text-sm">Get AI-powered crop recommendations based on your conditions</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Year Input */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Calendar size={14} className="text-[#688557]" />
                                Year
                            </label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#688557] focus:outline-none transition-colors text-slate-800 font-medium"
                                min={yearRange.min}
                                max={yearRange.max}
                                disabled={isLoadingOptions}
                            />
                        </div>

                        {/* Season Dropdown */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Sun size={14} className="text-[#688557]" />
                                Season
                            </label>
                            <select
                                value={season}
                                onChange={(e) => setSeason(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#688557] focus:outline-none transition-colors text-slate-800 font-medium bg-white cursor-pointer"
                            >
                                {seasons.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Month Dropdown */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Calendar size={14} className="text-[#688557]" />
                                Month
                            </label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#688557] focus:outline-none transition-colors text-slate-800 font-medium bg-white cursor-pointer"
                            >
                                {months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* Soil Type Dropdown */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Layers size={14} className="text-[#688557]" />
                                Soil Type
                            </label>
                            <select
                                value={soilType}
                                onChange={(e) => setSoilType(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#688557] focus:outline-none transition-colors text-slate-800 font-medium bg-white cursor-pointer"
                            >
                                {soilTypes.map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Predict Button */}
                    <button
                        onClick={handleCropPrediction}
                        disabled={isPredicting || isLoadingOptions}
                        className="w-full py-4 bg-[#688557] hover:bg-[#5a744b] disabled:bg-slate-400 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        {isPredicting ? (
                            <>
                                <Activity size={20} className="animate-spin" />
                                Predicting...
                            </>
                        ) : (
                            <>
                                <Brain size={20} />
                                Predict Crop
                            </>
                        )}
                    </button>

                    {/* Predicted Crop Result */}
                    {predictedCrop && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mt-6 p-8 bg-gradient-to-r from-[#688557]/10 to-emerald-50 rounded-xl border-2 border-[#688557]/30 shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#688557] flex items-center justify-center">
                                    <Target className="text-white" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Predicted Crop</h3>
                            </div>
                            <div className="bg-white rounded-lg p-4 mb-3">
                                <p className="text-4xl font-extrabold text-[#688557] text-center">{predictedCrop}</p>
                            </div>
                            <p className="text-sm text-slate-500 text-center">Based on your selected parameters: {year}, {season}, {month}, {soilType}</p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Water Prediction Form Section */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 mb-10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Droplets className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">Water Prediction</h2>
                            <p className="text-slate-500 text-sm">Get AI-powered water requirement predictions for your crops</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Crop Dropdown */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Sprout size={14} className="text-blue-600" />
                                Crop
                            </label>
                            <select
                                value={waterCrop}
                                onChange={(e) => setWaterCrop(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-800 font-medium bg-white cursor-pointer"
                            >
                                <option value="Lettuce">Lettuce</option>
                                <option value="Microgreens">Microgreens</option>
                                <option value="Tomato">Tomato</option>
                                <option value="Strawberry">Strawberry</option>
                                <option value="Pepper/Chili">Pepper/Chili</option>
                                <option value="Eggplant">Eggplant</option>
                                <option value="Onion">Onion</option>
                            </select>
                        </div>

                        {/* Soil Type Dropdown */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Layers size={14} className="text-blue-600" />
                                Soil Type
                            </label>
                            <select
                                value={waterSoil}
                                onChange={(e) => setWaterSoil(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-800 font-medium bg-white cursor-pointer"
                            >
                                <option value="Clay">Clay</option>
                                <option value="Sandy">Sandy</option>
                                <option value="Loamy">Loamy</option>
                            </select>
                        </div>

                        {/* Month Dropdown */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Calendar size={14} className="text-blue-600" />
                                Month
                            </label>
                            <select
                                value={waterMonth}
                                onChange={(e) => setWaterMonth(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-800 font-medium bg-white cursor-pointer"
                            >
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                        </div>

                        {/* Season Dropdown */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Sun size={14} className="text-blue-600" />
                                Season
                            </label>
                            <select
                                value={waterSeason}
                                onChange={(e) => setWaterSeason(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-800 font-medium bg-white cursor-pointer"
                            >
                                <option value="Summer">Summer</option>
                                <option value="Monsoon">Monsoon</option>
                                <option value="Winter">Winter</option>
                            </select>
                        </div>

                        {/* Year Input */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Calendar size={14} className="text-blue-600" />
                                Year
                            </label>
                            <input
                                type="number"
                                value={waterYear}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val >= 2000 && val <= 2100) {
                                        setWaterYear(val);
                                    }
                                }}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-800 font-medium"
                                min={2000}
                                max={2100}
                            />
                        </div>

                        {/* Temperature Dropdown */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Zap size={14} className="text-blue-600" />
                                Temperature (°C)
                            </label>
                            <select
                                value={waterTemperature}
                                onChange={(e) => setWaterTemperature(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none transition-colors text-slate-800 font-medium bg-white cursor-pointer"
                            >
                                <option value={18}>18°C</option>
                                <option value={20}>20°C</option>
                                <option value={22}>22°C</option>
                                <option value={25}>25°C</option>
                                <option value={28}>28°C</option>
                                <option value={30}>30°C</option>
                                <option value={32}>32°C</option>
                                <option value={35}>35°C</option>
                            </select>
                        </div>
                    </div>

                    {/* Predict Water Button */}
                    <button
                        onClick={handleWaterPrediction}
                        disabled={isPredictingWater}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                        {isPredictingWater ? (
                            <>
                                <Activity size={20} className="animate-spin" />
                                Predicting Water Requirements...
                            </>
                        ) : (
                            <>
                                <Droplets size={20} />
                                Predict Water Requirements
                            </>
                        )}
                    </button>

                    {/* Water Prediction Result */}
                    {waterPrediction && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mt-6 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Droplets className="text-white" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Water Prediction Result</h3>
                            </div>
                            
                            <div className="bg-white rounded-lg p-6 mb-4">
                                <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {waterPrediction.prediction}
                                </p>
                            </div>
                            
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Input Parameters</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                    <div><span className="font-semibold text-slate-600">Crop:</span> <span className="text-slate-700">{waterPrediction.input?.crop || waterCrop}</span></div>
                                    <div><span className="font-semibold text-slate-600">Soil:</span> <span className="text-slate-700">{waterPrediction.input?.soil || waterSoil}</span></div>
                                    <div><span className="font-semibold text-slate-600">Month:</span> <span className="text-slate-700">{waterPrediction.input?.month || waterMonth}</span></div>
                                    <div><span className="font-semibold text-slate-600">Season:</span> <span className="text-slate-700">{waterPrediction.input?.season || waterSeason}</span></div>
                                    <div><span className="font-semibold text-slate-600">Year:</span> <span className="text-slate-700">{waterPrediction.input?.year || waterYear}</span></div>
                                    <div><span className="font-semibold text-slate-600">Temperature:</span> <span className="text-slate-700">{waterPrediction.input?.temperature || waterTemperature}°C</span></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

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
