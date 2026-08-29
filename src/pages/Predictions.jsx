import React, { useState } from 'react';
import { 
  Brain, Droplets, Sprout, Activity, Zap, TrendingUp, 
  Calendar, Sun, Layers, Thermometer, FlaskConical, CloudRain,
  Target, ChevronRight, Scan, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const API_BASE_URL = 'https://aiot-vertical-farming-backend.onrender.com';

/* ── Constants ── */
const VERTICAL_SOILS = ['Clay', 'Sandy', 'Loamy'];
const HORIZONTAL_SOILS = ['Clay', 'Sandy', 'Loamy', 'Alluvial'];
const SEASONS = ['Winter', 'Summer', 'Rainy'];
const MONTH_RANGES = ['December-February', 'June-September', 'March-May'];

const WATER_CROPS = ['Lettuce', 'Microgreens', 'Tomato', 'Strawberry', 'Pepper/Chili', 'Eggplant', 'Onion'];
const WATER_SOILS = ['Clay', 'Sandy', 'Loamy'];
const WATER_SEASONS = ['Summer', 'Monsoon', 'Winter'];
const WATER_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const TEMPERATURES = [18, 20, 22, 25, 28, 30, 32, 35];

const MLPredictions = () => {
  /* ── Active Model Tab ── */
  const [activeModel, setActiveModel] = useState('vertical');

  /* ── Vertical Farming State ── */
  const [verticalForm, setVerticalForm] = useState({
    N: 100, P: 75, K: 31,
    temperature: 25, humidity: 60, ph: 6.5, rainfall: 150,
    soiltype: 'Clay', season: 'Winter', month: 'December-February',
  });
  const [verticalResult, setVerticalResult] = useState(null);
  const [isPredictingVertical, setIsPredictingVertical] = useState(false);

  /* ── Horizontal Farming State ── */
  const [horizontalForm, setHorizontalForm] = useState({
    N: 100, P: 75, K: 31,
    temperature: 25, humidity: 60, ph: 6.5, rainfall: 150,
    soiltype: 'Clay', season: 'Winter', month: 'December-February',
  });
  const [horizontalResult, setHorizontalResult] = useState(null);
  const [isPredictingHorizontal, setIsPredictingHorizontal] = useState(false);

  /* ── Water Prediction State ── */
  const [waterForm, setWaterForm] = useState({
    crop: 'Lettuce', soil: 'Clay', month: 'January',
    season: 'Summer', temperature: 25,
  });
  const [waterPrediction, setWaterPrediction] = useState(null);
  const [isPredictingWater, setIsPredictingWater] = useState(false);

  /* ── Handlers ── */
  const updateVertical = (key, value) => setVerticalForm(prev => ({ ...prev, [key]: value }));
  const updateHorizontal = (key, value) => setHorizontalForm(prev => ({ ...prev, [key]: value }));
  const updateWater = (key, value) => setWaterForm(prev => ({ ...prev, [key]: value }));

  const handleVerticalPrediction = async () => {
    setIsPredictingVertical(true);
    setVerticalResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/crop/predict-vertical`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verticalForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Prediction failed');
      if (!data.prediction) throw new Error('No prediction returned');
      setVerticalResult(data.prediction);
      toast.success('Vertical farming prediction successful!');
    } catch (err) {
      toast.error(err.message || 'Error contacting prediction API');
    } finally {
      setIsPredictingVertical(false);
    }
  };

  const handleHorizontalPrediction = async () => {
    setIsPredictingHorizontal(true);
    setHorizontalResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/crop/predict-horizontal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(horizontalForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Prediction failed');
      if (!data.prediction) throw new Error('No prediction returned');
      setHorizontalResult(data.prediction);
      toast.success('Horizontal farming prediction successful!');
    } catch (err) {
      toast.error(err.message || 'Error contacting prediction API');
    } finally {
      setIsPredictingHorizontal(false);
    }
  };

  const handleWaterPrediction = async () => {
    setIsPredictingWater(true);
    setWaterPrediction(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/crop/predict-water`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waterForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Water prediction failed');
      if (!data.prediction) throw new Error('No prediction returned');
      setWaterPrediction({ prediction: data.prediction, input: { ...waterForm } });
      toast.success('Water prediction generated successfully!');
    } catch (err) {
      toast.error(err.message || 'Error contacting prediction API');
    } finally {
      setIsPredictingWater(false);
    }
  };

  /* ── Farming Input Grid (shared between vertical & horizontal) ── */
  const renderFarmingInputs = (form, updateFn, soils) => (
    <>
      {/* NPK + Environment Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
        {[
          { key: 'N', label: 'Nitrogen (N)', icon: FlaskConical, step: 1 },
          { key: 'P', label: 'Phosphorus (P)', icon: FlaskConical, step: 1 },
          { key: 'K', label: 'Potassium (K)', icon: FlaskConical, step: 1 },
          { key: 'temperature', label: 'Temperature (°C)', icon: Thermometer, step: 1 },
          { key: 'humidity', label: 'Humidity (%)', icon: Droplets, step: 1 },
          { key: 'ph', label: 'pH Level', icon: FlaskConical, step: 0.1 },
          { key: 'rainfall', label: 'Rainfall (mm)', icon: CloudRain, step: 1 },
        ].map(({ key, label, icon: Icon, step }) => (
          <div key={key}>
            <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              {label}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon size={14} />
              </div>
              <input
                type="number"
                value={form[key]}
                onChange={(e) => updateFn(key, Number(e.target.value))}
                step={step}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium text-gray-900 focus:outline-none transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Soil Type</label>
          <select
            value={form.soiltype}
            onChange={(e) => updateFn('soiltype', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-semibold text-gray-800 focus:outline-none transition-all"
          >
            {soils.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Season</label>
          <select
            value={form.season}
            onChange={(e) => updateFn('season', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-semibold text-gray-800 focus:outline-none transition-all"
          >
            {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Month Range</label>
          <select
            value={form.month}
            onChange={(e) => updateFn('month', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-semibold text-gray-800 focus:outline-none transition-all"
          >
            {MONTH_RANGES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
    </>
  );

  /* ── Water Inputs ── */
  const renderWaterInputs = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Crop</label>
        <select value={waterForm.crop} onChange={(e) => updateWater('crop', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-semibold text-gray-800 focus:outline-none transition-all">
          {WATER_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Soil Type</label>
        <select value={waterForm.soil} onChange={(e) => updateWater('soil', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-semibold text-gray-800 focus:outline-none transition-all">
          {WATER_SOILS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Month</label>
        <select value={waterForm.month} onChange={(e) => updateWater('month', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-semibold text-gray-800 focus:outline-none transition-all">
          {WATER_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Season</label>
        <select value={waterForm.season} onChange={(e) => updateWater('season', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-semibold text-gray-800 focus:outline-none transition-all">
          {WATER_SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Temperature (°C)</label>
        <select value={waterForm.temperature} onChange={(e) => updateWater('temperature', Number(e.target.value))}
          className="w-full px-3.5 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-semibold text-gray-800 focus:outline-none transition-all">
          {TEMPERATURES.map(t => <option key={t} value={t}>{t}°C</option>)}
        </select>
      </div>
    </div>
  );

  const MODEL_TABS = [
    { id: 'vertical', label: '🌱 Vertical Farming', icon: Layers },
    { id: 'horizontal', label: '🌾 Horizontal Farming', icon: Sprout },
    { id: 'water', label: '💧 Water Prediction', icon: Droplets },
  ];

  return (
    <main className="min-h-screen bg-agri-light pt-28 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-x-hidden">
      {/* Floating background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-[#C49E40]/5 blur-3xl"
          animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 -right-32 w-[480px] h-[480px] rounded-full bg-[#213E20]/4 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

      {/* ── Page Header (Market Rates style) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#213E20] text-[#D9EFBD] text-sm md:text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
              <Brain size={14} className="text-[#C49E40]" /> AIoT Intelligence
            </span>
            <span className="text-sm md:text-xs text-gray-500 font-semibold">
              Machine Learning Models
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#1F3B21] tracking-tight">
            Smart Farming Predictions
          </h1>
          <p className="text-gray-600 text-sm mt-1 max-w-2xl">
            Real-time ML insights to optimize your farm's yield, resource usage, and harvest timing across vertical and horizontal systems.
          </p>
        </div>
      </div>

      {/* ── Stat Cards (Market Rates style) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-gray-200/70 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-sm md:text-xs font-bold uppercase tracking-wider">Models Active</span>
            <div className="p-2 bg-[#213E20]/5 rounded-lg text-[#213E20]">
              <Brain size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1F3B21]">3</div>
          <span className="text-sm md:text-[11px] text-gray-400 font-medium">Vertical, Horizontal, Water</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-gray-200/70 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-sm md:text-xs font-bold uppercase tracking-wider">Model Accuracy</span>
            <div className="p-2 bg-[#C49E40]/10 rounded-lg text-[#C49E40]">
              <Target size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-[#C49E40]">98.5%</div>
          <span className="text-sm md:text-[11px] text-gray-400 font-medium">Random Forest Regressor v2.1</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-gray-200/70 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-sm md:text-xs font-bold uppercase tracking-wider">Water Savings</span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-700">
              <Droplets size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700">3,240 L</div>
          <span className="text-sm md:text-[11px] text-gray-400 font-medium">Projected monthly saving</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-gray-200/70 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-sm md:text-xs font-bold uppercase tracking-wider">Projected Yield</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-700">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">125 kg</div>
          <span className="text-sm md:text-[11px] text-emerald-700 font-bold">+12% vs last cycle</span>
        </div>
      </div>

      {/* ── Model Selector Tabs (Market Rates filter bar style) ── */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-gray-200/80 shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500">Select Prediction Model</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {MODEL_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveModel(id)}
                className={`px-4 py-2.5 rounded-lg text-sm md:text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeModel === id
                    ? 'bg-white text-[#1F3B21] shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Prediction Form Area ── */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-md mb-8">

        {/* ═══ VERTICAL FARMING ═══ */}
        {activeModel === 'vertical' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600">
                <Layers size={22} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-black text-[#1F3B21]">Vertical Farming Prediction</h2>
                <p className="text-gray-500 text-sm md:text-xs font-medium">Predict the best crop for your vertical farm based on soil & climate data</p>
              </div>
            </div>

            {renderFarmingInputs(verticalForm, updateVertical, VERTICAL_SOILS)}

            <button
              onClick={handleVerticalPrediction}
              disabled={isPredictingVertical}
              className="w-full py-3.5 bg-[#213E20] hover:bg-[#152a16] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl font-bold text-white text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {isPredictingVertical ? (
                <><Activity size={16} className="animate-spin" /> Predicting...</>
              ) : (
                <><Brain size={16} /> Predict Vertical Crop</>
              )}
            </button>

            {verticalResult && (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-xl border border-blue-200/70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                    <Target className="text-white" size={16} />
                  </div>
                  <span className="text-sm md:text-xs font-bold uppercase tracking-wider text-blue-700">Predicted Crop (Vertical)</span>
                </div>
                <div className="bg-white rounded-xl p-5 mb-3 border border-blue-100">
                  <p className="text-3xl font-black text-[#1F3B21] text-center">{verticalResult}</p>
                </div>
                <p className="text-sm md:text-xs text-gray-500 text-center font-medium">
                  N:{verticalForm.N} P:{verticalForm.P} K:{verticalForm.K} • {verticalForm.soiltype} soil • {verticalForm.season} • {verticalForm.month} • {verticalForm.temperature}°C
                </p>
              </div>
            )}
          </>
        )}

        {/* ═══ HORIZONTAL FARMING ═══ */}
        {activeModel === 'horizontal' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                <Sprout size={22} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-black text-[#1F3B21]">Horizontal Farming Prediction</h2>
                <p className="text-gray-500 text-sm md:text-xs font-medium">Predict the best crop for traditional open-field farming conditions</p>
              </div>
            </div>

            {renderFarmingInputs(horizontalForm, updateHorizontal, HORIZONTAL_SOILS)}

            <button
              onClick={handleHorizontalPrediction}
              disabled={isPredictingHorizontal}
              className="w-full py-3.5 bg-[#213E20] hover:bg-[#152a16] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl font-bold text-white text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {isPredictingHorizontal ? (
                <><Activity size={16} className="animate-spin" /> Predicting...</>
              ) : (
                <><Brain size={16} /> Predict Horizontal Crop</>
              )}
            </button>

            {horizontalResult && (
              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50/80 to-green-50/50 rounded-xl border border-emerald-200/70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center">
                    <Target className="text-white" size={16} />
                  </div>
                  <span className="text-sm md:text-xs font-bold uppercase tracking-wider text-emerald-700">Predicted Crop (Horizontal)</span>
                </div>
                <div className="bg-white rounded-xl p-5 mb-3 border border-emerald-100">
                  <p className="text-3xl font-black text-[#1F3B21] text-center">{horizontalResult}</p>
                </div>
                <p className="text-sm md:text-xs text-gray-500 text-center font-medium">
                  N:{horizontalForm.N} P:{horizontalForm.P} K:{horizontalForm.K} • {horizontalForm.soiltype} soil • {horizontalForm.season} • {horizontalForm.month} • {horizontalForm.temperature}°C
                </p>
              </div>
            )}
          </>
        )}

        {/* ═══ WATER PREDICTION ═══ */}
        {activeModel === 'water' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-600">
                <Droplets size={22} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-black text-[#1F3B21]">Water Requirement Prediction</h2>
                <p className="text-gray-500 text-sm md:text-xs font-medium">Get AI-powered water requirement predictions for your crops</p>
              </div>
            </div>

            {renderWaterInputs()}

            <button
              onClick={handleWaterPrediction}
              disabled={isPredictingWater}
              className="w-full py-3.5 bg-[#213E20] hover:bg-[#152a16] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl font-bold text-white text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {isPredictingWater ? (
                <><Activity size={16} className="animate-spin" /> Predicting Water Requirements...</>
              ) : (
                <><Droplets size={16} /> Predict Water Requirement</>
              )}
            </button>

            {waterPrediction && (
              <div className="mt-6 p-6 bg-gradient-to-r from-cyan-50/80 to-sky-50/50 rounded-xl border border-cyan-200/70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center">
                    <Droplets className="text-white" size={16} />
                  </div>
                  <span className="text-sm md:text-xs font-bold uppercase tracking-wider text-cyan-700">Water Prediction Result</span>
                </div>
                <div className="bg-white rounded-xl p-5 mb-4 border border-cyan-100">
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                    {waterPrediction.prediction}
                  </p>
                </div>
                <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/70">
                  <p className="text-sm md:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Input Parameters</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    <div><span className="font-semibold text-gray-600">Crop:</span> <span className="text-gray-800">{waterPrediction.input?.crop}</span></div>
                    <div><span className="font-semibold text-gray-600">Soil:</span> <span className="text-gray-800">{waterPrediction.input?.soil}</span></div>
                    <div><span className="font-semibold text-gray-600">Month:</span> <span className="text-gray-800">{waterPrediction.input?.month}</span></div>
                    <div><span className="font-semibold text-gray-600">Season:</span> <span className="text-gray-800">{waterPrediction.input?.season}</span></div>
                    <div><span className="font-semibold text-gray-600">Temp:</span> <span className="text-gray-800">{waterPrediction.input?.temperature}°C</span></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Model Info Cards (bottom strip) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Layers,
            color: 'bg-blue-500/10 text-blue-600',
            title: 'Vertical Model',
            desc: 'Optimized for stacked multi-layer hydroponic systems. Uses N/P/K, climate, and soil data to recommend the best crop.',
            tag: 'predict-vertical',
          },
          {
            icon: Sprout,
            color: 'bg-emerald-500/10 text-emerald-600',
            title: 'Horizontal Model',
            desc: 'Designed for traditional open-field and greenhouse farming. Supports additional soil types like Alluvial.',
            tag: 'predict-horizontal',
          },
          {
            icon: Droplets,
            color: 'bg-cyan-500/10 text-cyan-600',
            title: 'Water Model',
            desc: 'Predicts water requirements based on crop type, soil, seasonal conditions, and ambient temperature.',
            tag: 'predict-water',
          },
        ].map(({ icon: Icon, color, title, desc, tag }) => (
          <div
            key={tag}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-gray-200/70 shadow-sm group hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setActiveModel(tag.replace('predict-', ''))}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                <span className="text-sm md:text-[10px] font-mono text-gray-400">/api/crop/{tag}</span>
              </div>
            </div>
            <p className="text-sm md:text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
            <div className="mt-3 flex items-center gap-1 text-sm md:text-xs font-bold text-[#C49E40] group-hover:text-[#b38f3a] transition-colors">
              Use this model <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      </div>
    </main>
  );
};

export default MLPredictions;
