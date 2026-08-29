import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Video, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminLiveStreams = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ streamUrl: '', title: '', description: '', isActive: true });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStreams = async () => {
    try {
      const token = localStorage.getItem('farm_token');
      const res = await axios.get(`${API_URL}/admin/live-streams`, { headers: { Authorization: `Bearer ${token}` } });
      setStreams(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch streams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStreams(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stream?")) return;
    try {
      const token = localStorage.getItem('farm_token');
      await axios.delete(`${API_URL}/admin/live-streams/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Stream deleted');
      fetchStreams();
    } catch (error) {
      toast.error('Failed to delete stream');
    }
  };

  const handleToggleActive = async (stream) => {
    try {
      const token = localStorage.getItem('farm_token');
      await axios.put(`${API_URL}/admin/live-streams/${stream._id}`, { ...stream, isActive: !stream.isActive }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Stream ${!stream.isActive ? 'activated' : 'deactivated'}`);
      fetchStreams();
    } catch (error) {
      toast.error('Failed to update stream');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('farm_token');
      await axios.post(`${API_URL}/admin/live-streams`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Stream added successfully');
      setFormData({ streamUrl: '', title: '', description: '', isActive: true });
      fetchStreams();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add stream');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 rounded-xl text-[#C49E40]">
            <Video size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Add Live Stream</h3>
            <p className="text-sm text-gray-500">Provide an HLS (.m3u8) or MP4 URL for the live feed.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="url" required placeholder="Stream URL (https://...)" value={formData.streamUrl} onChange={(e) => setFormData({...formData, streamUrl: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]" />
            <input type="text" placeholder="Description (Optional)" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#C49E40]" />
          </div>
          <button type="submit" className="px-6 py-3 bg-[#C49E40] text-white font-bold rounded-xl hover:bg-[#b38f3a] transition-colors">
            Add Stream
          </button>
        </form>
      </div>

      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-4">Stream History</h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-sm md:text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {streams.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(stream => (
                <tr key={stream._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{stream.title || 'Live Stream'}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={stream.streamUrl}>{stream.streamUrl}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleActive(stream)} className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm md:text-xs font-bold ${stream.isActive ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'}`}>
                      {stream.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {stream.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(stream._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {streams.length === 0 && <tr><td colSpan="4" className="px-6 py-4 text-center">No streams found.</td></tr>}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage} 
            totalPages={Math.ceil(streams.length / itemsPerPage)} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLiveStreams;
