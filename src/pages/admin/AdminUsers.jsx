import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, Trash2 } from 'lucide-react';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', zoneId: '', phone: '' });
  const [zones, setZones] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('farm_token');
      const [userRes, zoneRes] = await Promise.all([
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/zones`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(userRes.data.data);
      setZones(zoneRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem('farm_token');
      await axios.delete(`${API_URL}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('farm_token');
      await axios.post(`${API_URL}/admin/users`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('User added successfully');
      setShowAddModal(false);
      fetchUsers();
      setFormData({ name: '', email: '', password: '', role: 'user', zoneId: '', phone: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl text-[#C49E40]">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">User Management</h3>
            <p className="text-sm text-gray-500">Manage admins and farmers.</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-[#C49E40] text-white font-bold rounded-lg hover:bg-[#b38f3a]">
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-gray-700 text-sm md:text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Role & Zone</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(user => (
              <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4">
                  <div>{user.email}</div>
                  <div className="text-sm md:text-xs text-gray-400">{user.phone || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm md:text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {user.role === 'user' ? 'Farmer' : 'Admin'}
                  </span>
                  {user.zoneId && <div className="text-sm md:text-xs mt-1 text-gray-500">Zone: {user.zoneId.name}</div>}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(users.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
              <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
              <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
              <input type="tel" placeholder="Phone (Optional)" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]" />
              <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]">
                <option value="user">Farmer</option>
                <option value="admin">Admin</option>
              </select>
              {formData.role === 'user' && (
                <select required value={formData.zoneId} onChange={e => setFormData({ ...formData, zoneId: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C49E40] focus:ring-1 focus:ring-[#C49E40]">
                  <option value="">Select Zone</option>
                  {zones.map(z => <option key={z._id} value={z._id}>{z.name} ({z.code})</option>)}
                </select>
              )}
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

export default AdminUsers;

