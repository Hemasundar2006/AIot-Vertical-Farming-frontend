import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapPin, Trash2 } from 'lucide-react';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', location: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchZones = async () => {
    try {
      const token = localStorage.getItem('farm_token');
      const res = await axios.get(`${API_URL}/admin/zones`, { headers: { Authorization: `Bearer ${token}` } });
      setZones(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchZones(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) return;
    try {
      const token = localStorage.getItem('farm_token');
      await axios.delete(`${API_URL}/admin/zones/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Zone deleted');
      fetchZones();
    } catch (error) {
      toast.error('Failed to delete zone');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('farm_token');
      await axios.post(`${API_URL}/admin/zones`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Zone added successfully');
      setShowAddModal(false);
      fetchZones();
      setFormData({ name: '', code: '', location: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add zone');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl text-[#C49E40]">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Zone Management</h3>
            <p className="text-sm text-gray-500">Manage farm zones and locations.</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-[#C49E40] text-white font-bold rounded-lg hover:bg-[#b38f3a]">
          Add Zone
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-gray-700 text-sm md:text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Zone Name</th>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(zone => (
              <tr key={zone._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{zone.name}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded-md font-mono text-sm md:text-xs">{zone.code}</span></td>
                <td className="px-6 py-4">{zone.location || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm md:text-xs font-bold ${zone.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {zone.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(zone._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination 
          currentPage={currentPage} 
          totalPages={Math.ceil(zones.length / itemsPerPage)} 
          onPageChange={setCurrentPage} 
        />
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Zone</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input required type="text" placeholder="Zone Name (e.g. North Greenhouse)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
              <input required type="text" placeholder="Zone Code (e.g. Z-NORTH-01)" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40] font-mono" />
              <input type="text" placeholder="Location Description (Optional)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-bold transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-[#C49E40] text-white rounded-lg font-bold hover:bg-[#b38f3a] transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminZones;
