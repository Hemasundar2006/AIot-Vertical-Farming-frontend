import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const DataDownload = () => {
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('farm_token');
      const response = await axios.get(`${API_URL}/user/sensor-data/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sensor_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report. Ensure you have sensor data for this month.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-amber-900/10">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Data Download & Reports</h1>
        <p className="text-amber-800 mb-6">
          Export your farm data, analytics, and sensor history as downloadable reports.
        </p>
        <div className="flex gap-4">
          <button className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg transition-colors opacity-50 cursor-not-allowed">
            Download CSV (Coming Soon)
          </button>
          <button 
            onClick={handleDownloadPDF} 
            disabled={loading}
            className="bg-amber-900 hover:bg-amber-950 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? 'Generating...' : 'Download PDF Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataDownload;
