import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { fetchDailyData, fetchMonthlyData } from '../services/sensorApiService';
import { Calendar, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Helper function to get soil name from zone key
const getSoilName = (zoneKey) => {
  const soilNames = {
    'zone1': 'Black Soil',
    'zone2': 'Red Soil',
    'zone3': 'Sand'
  };
  return soilNames[zoneKey] || zoneKey;
};

const SensorGraphs = ({ initialZone = null }) => {
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'monthly'
  const [selectedZone, setSelectedZone] = useState(initialZone || 'zone1');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dailyData, setDailyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update selected zone when initialZone prop changes
  useEffect(() => {
    if (initialZone) {
      setSelectedZone(initialZone);
    }
  }, [initialZone]);

  // Fetch daily data
  const fetchDailyDataHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDailyData(selectedZone, selectedDate);
      setDailyData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch daily data');
      setDailyData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedZone, selectedDate]);

  // Fetch monthly data
  const fetchMonthlyDataHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMonthlyData(selectedZone, selectedYear, selectedMonth);
      setMonthlyData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch monthly data');
      setMonthlyData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedZone, selectedYear, selectedMonth]);

  useEffect(() => {
    if (viewMode === 'daily') {
      fetchDailyDataHandler();
    } else {
      fetchMonthlyDataHandler();
    }
  }, [viewMode, fetchDailyDataHandler, fetchMonthlyDataHandler]);

  // Prepare daily chart data
  const getDailyChartData = useMemo(() => {
    if (!dailyData || !dailyData.data || dailyData.data.length === 0) {
      return null;
    }

    const labels = dailyData.data.map((item) => new Date(item.time));
    const tempData = dailyData.data.map((item) => item.temp);
    const humData = dailyData.data.map((item) => item.hum);
    const soilData = dailyData.data.map((item) => item.soil);
    const gasData = dailyData.data.map((item) => item.gas);
    const lightData = dailyData.data.map((item) => item.light);

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: tempData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          yAxisID: 'y',
          tension: 0.4,
        },
        {
          label: 'Humidity (%)',
          data: humData,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          yAxisID: 'y',
          tension: 0.4,
        },
        {
          label: 'Soil Moisture',
          data: soilData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          yAxisID: 'y1',
          tension: 0.4,
        },
        {
          label: 'Gas (PPM)',
          data: gasData,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.1)',
          yAxisID: 'y2',
          tension: 0.4,
          hidden: true,
        },
        {
          label: 'Light (Lx)',
          data: lightData,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.1)',
          yAxisID: 'y2',
          tension: 0.4,
          hidden: true,
        },
      ],
    };
  }, [dailyData]);

  // Prepare monthly chart data
  const getMonthlyChartData = useMemo(() => {
    if (!monthlyData || !monthlyData.data || monthlyData.data.length === 0) {
      return null;
    }

    const labels = monthlyData.data.map((item) => item.date);
    const avgTempData = monthlyData.data.map((item) => item.avgTemp);
    const avgHumData = monthlyData.data.map((item) => item.avgHum);
    const maxTempData = monthlyData.data.map((item) => item.maxTemp);
    const minTempData = monthlyData.data.map((item) => item.minTemp);
    const avgSoilData = monthlyData.data.map((item) => item.avgSoil);

    return {
      labels,
      datasets: [
        {
          label: 'Average Temperature (°C)',
          data: avgTempData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          type: 'line',
          tension: 0.4,
        },
        {
          label: 'Max Temperature (°C)',
          data: maxTempData,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          type: 'line',
          tension: 0.4,
        },
        {
          label: 'Min Temperature (°C)',
          data: minTempData,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          type: 'line',
          tension: 0.4,
        },
        {
          label: 'Average Humidity (%)',
          data: avgHumData,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.3)',
          type: 'bar',
        },
        {
          label: 'Average Soil Moisture',
          data: avgSoilData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.3)',
          type: 'bar',
          hidden: true,
        },
      ],
    };
  }, [monthlyData]);

  const dailyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Daily Sensor Data - ${getSoilName(selectedZone)} - ${selectedDate}`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          title: (context) => {
            return new Date(context[0].parsed.x).toLocaleString();
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm',
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°C) / Humidity (%)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Soil Moisture',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Gas / Light',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Monthly Sensor Data - ${getSoilName(selectedZone)} - ${selectedYear}/${String(selectedMonth).padStart(2, '0')}`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°C) / Humidity (%)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const handleRefresh = () => {
    if (viewMode === 'daily') {
      fetchDailyDataHandler();
    } else {
      fetchMonthlyDataHandler();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-600" />
            <label className="text-sm font-semibold text-slate-700">View Mode:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="daily">Daily View</option>
              <option value="monthly">Monthly View</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Soil Type:</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="zone1">Black Soil</option>
              <option value="zone2">Red Soil</option>
              <option value="zone3">Sand</option>
            </select>
          </div>

          {viewMode === 'daily' ? (
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-emerald-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-700">Year:</label>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value) || new Date().getFullYear())}
                  min="2000"
                  max="2100"
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-700">Month:</label>
                <input
                  type="number"
                  value={selectedMonth}
                  onChange={(e) => {
                    const month = parseInt(e.target.value) || 1;
                    setSelectedMonth(Math.max(1, Math.min(12, month)));
                  }}
                  min="1"
                  max="12"
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium w-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle size={20} className="text-red-600" />
          <div>
            <p className="text-red-800 font-semibold">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw size={32} className="text-emerald-600 animate-spin" />
            <p className="text-slate-600 font-medium">Loading sensor data...</p>
          </div>
        </div>
      )}

      {/* Charts */}
      {!loading && viewMode === 'daily' && getDailyChartData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="h-[500px]">
            <Line data={getDailyChartData} options={dailyChartOptions} />
          </div>
          {dailyData?.summary && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Avg Temperature</p>
                <p className="text-xl font-bold text-orange-600">{dailyData.summary.avgTemp.toFixed(2)}°C</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Avg Humidity</p>
                <p className="text-xl font-bold text-blue-600">{dailyData.summary.avgHum.toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Avg Soil</p>
                <p className="text-xl font-bold text-emerald-600">{dailyData.summary.avgSoil.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Total Readings</p>
                <p className="text-xl font-bold text-slate-700">{dailyData.summary.totalReadings}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {!loading && viewMode === 'monthly' && getMonthlyChartData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
          <div className="h-[500px]">
            <Bar data={getMonthlyChartData} options={monthlyChartOptions} />
          </div>
          {monthlyData?.summary && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Overall Avg Temp</p>
                <p className="text-xl font-bold text-orange-600">{monthlyData.summary.overallAvgTemp.toFixed(2)}°C</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Overall Avg Humidity</p>
                <p className="text-xl font-bold text-blue-600">{monthlyData.summary.overallAvgHum.toFixed(2)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Max Temperature</p>
                <p className="text-xl font-bold text-red-600">{monthlyData.summary.maxTemp.toFixed(2)}°C</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Min Temperature</p>
                <p className="text-xl font-bold text-blue-600">{monthlyData.summary.minTemp.toFixed(2)}°C</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Total Days</p>
                <p className="text-xl font-bold text-slate-700">{monthlyData.summary.totalDays}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Total Readings</p>
                <p className="text-xl font-bold text-slate-700">{monthlyData.summary.totalReadings}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {!loading && !error && 
       ((viewMode === 'daily' && (!dailyData || !dailyData.data || dailyData.data.length === 0)) ||
        (viewMode === 'monthly' && (!monthlyData || !monthlyData.data || monthlyData.data.length === 0))) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 shadow-lg border border-slate-100 text-center"
        >
          <AlertCircle size={48} className="text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-lg">No data available for the selected period.</p>
          <p className="text-slate-400 text-sm mt-2">Please try selecting a different date or month.</p>
        </motion.div>
      )}
    </div>
  );
};

export default SensorGraphs;

