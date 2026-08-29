import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminOverview = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem('farm_token');
        const res = await axios.get(`${API_URL}/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data.data);
      } catch (error) {
        console.error("Overview fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading overview...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-50 rounded-xl text-[#C49E40]">
          <FileText size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">System Overview</h3>
          <p className="text-sm text-gray-500">High-level statistics of the platform.</p>
        </div>
      </div>

      {reports ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center">
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Users</span>
            <span className="text-4xl font-black text-[#C49E40]">{reports.totalUsers}</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center">
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Zones</span>
            <span className="text-4xl font-black text-green-600">{reports.totalZones}</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center">
            <span className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Readings Today</span>
            <span className="text-4xl font-black text-blue-600">{reports.readingsToday}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">Failed to load reports.</div>
      )}
    </div>
  );
};

export default AdminOverview;
