import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('farm_token');
        const res = await axios.get(`${API_URL}/admin/login-logs`, { headers: { Authorization: `Bearer ${token}` } });
        setLogs(res.data.data);
      } catch (error) {
        console.error('Failed to fetch logs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-50 rounded-xl text-[#C49E40]">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">Security Logs</h3>
          <p className="text-sm text-gray-500">Recent login attempts across the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-gray-700 text-sm md:text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">IP Address</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(log => (
              <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{log.email}</td>
                <td className="px-6 py-4 capitalize">{log.role || 'Unknown'}</td>
                <td className="px-6 py-4 font-mono text-sm md:text-xs">{log.ipAddress || 'N/A'}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  {log.success ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                  {log.success ? 'Success' : 'Failed'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan="5" className="px-6 py-4 text-center">No logs found.</td></tr>}
          </tbody>
        </table>
        <Pagination 
          currentPage={currentPage} 
          totalPages={Math.ceil(logs.length / itemsPerPage)} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};

export default AdminLogs;
