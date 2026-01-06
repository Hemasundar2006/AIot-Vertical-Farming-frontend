import React, { useState } from 'react';

const API = 'https://aiot-vertical-farming-backend.onrender.com';

const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Alluvial'];
const seasons = ['Winter', 'Summer', 'Rainy'];
const months = ['December-February', 'June-September', 'March-May'];

const SmartFarmingPrediction = () => {
  const [mode, setMode] = useState('horizontal');
  const [result, setResult] = useState('');

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
    try {
      const url =
        mode === 'horizontal'
          ? '/api/crop/predict-horizontal'
          : '/api/crop/predict-vertical';
      const res = await fetch(API + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      setResult(data.prediction || 'No prediction returned');
    } catch (err) {
      setResult('Error contacting prediction API');
      console.error('Prediction error', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Smart Farming Prediction System</h2>
        <p className="text-slate-500 mb-6">
          Configure your soil and climate parameters to predict optimal farming outcomes.
        </p>

        <div className="flex gap-3 mb-8">
          <button
            type="button"
            onClick={() => setMode('horizontal')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
              mode === 'horizontal'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            🌾 Horizontal
          </button>
          <button
            type="button"
            onClick={() => setMode('vertical')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
              mode === 'vertical'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            🌱 Vertical
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-4">
          {mode === 'horizontal' ? 'Horizontal Farming' : 'Vertical Farming'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'].map((key) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">{key.toUpperCase()}</label>
              <input
                type="number"
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Soil Type</label>
            <select
              name="soiltype"
              value={form.soiltype}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {soilTypes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Season</label>
            <select
              name="season"
              value={form.season}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {seasons.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Month Range</label>
            <select
              name="month"
              value={form.month}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={predict}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md"
        >
          Predict
        </button>

        <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Result</h3>
          <p className="text-emerald-700 font-semibold text-base">
            {result || 'Run a prediction to see the suggested crop / outcome.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartFarmingPrediction;


