import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Send, User, Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminNotifications = () => {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    message: '',
    type: 'info'
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`);
      if (res.data.success) setUsers(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/notifications`);
      if (res.data.success) setNotifications(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId) return toast.error("Please select a user");

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/admin/notifications`, formData);
      if (res.data.success) {
        toast.success("Notification sent!");
        setFormData({ ...formData, title: '', message: '' });
        fetchNotifications();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-[#C49E40]" size={28} />
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">Send Notifications</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Send size={18} className="text-[#C49E40]" /> Compose
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select User</label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C49E40] outline-none text-sm font-medium"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              >
                <option value="">-- Choose User --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notification Type</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C49E40] outline-none text-sm font-medium"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="info">General Info</option>
                <option value="bill_pending">Bill Pending</option>
                <option value="alert">Alert / Warning</option>
                <option value="system">System Message</option>
              </select>
            </div>

            <div>
              <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Action Required: Unpaid Bill"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C49E40] outline-none text-sm font-medium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
              <textarea
                required
                rows="4"
                placeholder="Write your message here..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C49E40] outline-none text-sm font-medium resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C49E40] hover:bg-[#b38f3a] text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : <><Send size={16} /> Send Notification</>}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800">Sent Notifications History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm md:text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Recipient</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Title & Message</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((notif) => (
                  <tr key={notif._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{notif.userId?.name || 'Unknown'}</div>
                      <div className="text-sm md:text-xs text-gray-500">{notif.userId?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm md:text-[10px] font-bold uppercase tracking-wider ${
                        notif.type === 'alert' ? 'bg-red-100 text-red-700' :
                        notif.type === 'bill_pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {notif.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm font-bold text-gray-900 truncate">{notif.title}</div>
                      <div className="text-sm md:text-xs text-gray-500 truncate">{notif.message}</div>
                    </td>
                    <td className="px-6 py-4 text-sm md:text-xs font-medium text-gray-500">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {notif.isRead ? (
                        <span className="text-sm md:text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Read</span>
                      ) : (
                        <span className="text-sm md:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Unread</span>
                      )}
                    </td>
                  </tr>
                ))}
                {notifications.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 font-medium text-sm">
                      No notifications sent yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination 
              currentPage={currentPage} 
              totalPages={Math.ceil(notifications.length / itemsPerPage)} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
