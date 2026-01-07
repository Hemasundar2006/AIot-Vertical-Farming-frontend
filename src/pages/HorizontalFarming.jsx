import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://aiot-vertical-farming-backend.onrender.com';

const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Alluvial'];
const seasons = ['Winter', 'Summer', 'Rainy'];
const months = ['December-February', 'June-September', 'March-May'];

const HorizontalFarming = () => {
  const [result, setResult] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);

  const [form, setForm] = useState({
    N: 100,
    P: 75,
    K: 31,
    temperature: 25,
    humidity: 60,
    ph: 6.5,
    rainfall: 150,
    soiltype: 'Clay',
    season: 'Winter',
    month: 'December-February',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'soiltype' || name === 'season' || name === 'month' ? value : Number(value),
    }));
  };

  const predict = async () => {
    setIsPredicting(true);
    setResult('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/crop/predict-horizontal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to get prediction');
      }

      setResult(data.prediction || 'No prediction returned');
      toast.success('Prediction generated successfully!');
    } catch (err) {
      const errorMsg = err?.message || 'Error contacting prediction API';
      setResult(`Error: ${errorMsg}`);
      toast.error(errorMsg);
      console.error('Prediction error', err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4">
            <Sprout size={14} /> Horizontal Farming
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            🌾 Horizontal <span className="text-emerald-600">Farming Prediction</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Configure your soil and climate parameters to predict optimal horizontal farming outcomes
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Input Parameters</h2>

          {/* Numeric Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'].map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  {key === 'ph' ? 'pH' : key}
                </label>
                <input
                  type="number"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  step={key === 'ph' ? 0.1 : 1}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Soil Type</label>
              <select
                name="soiltype"
                value={form.soiltype}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                {soilTypes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Season</label>
              <select
                name="season"
                value={form.season}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Month Range</label>
              <select
                name="month"
                value={form.month}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Predict Button */}
          <motion.button
            type="button"
            onClick={predict}
            disabled={isPredicting}
            whileHover={{ scale: isPredicting ? 1 : 1.02 }}
            whileTap={{ scale: isPredicting ? 1 : 0.98 }}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold text-base shadow-lg transition-all"
          >
            {isPredicting ? 'Predicting...' : '🌾 Predict Crop'}
          </motion.button>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-100"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Sprout className="text-emerald-600" size={20} /> Prediction Result
              </h3>
              <p className="text-emerald-700 font-semibold text-lg">
                {result}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HorizontalFarming;



