import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (error) {
      toast.error("Error marking as read");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="text-red-500" size={24} />;
      case 'bill_pending': return <Clock className="text-orange-500" size={24} />;
      case 'system': return <Bell className="text-purple-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-agri-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C49E40] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 bg-agri-light px-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-agri-gold/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#213E20]/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
             <Bell className="text-[#C49E40]" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-agri-dark uppercase tracking-wide">Notifications</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Updates and alerts from your farm administrators</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl p-4 sm:p-8">
          {notifications.length === 0 ? (
             <div className="text-center py-16">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                 <CheckCircle2 className="text-gray-300" size={40} />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">You're all caught up!</h3>
               <p className="text-gray-500 text-sm">No new notifications at the moment.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${notif.isRead ? 'bg-white border-gray-100 opacity-70' : 'bg-[#C49E40]/5 border-[#C49E40]/20 shadow-sm'}`}
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                         <h3 className={`text-lg font-black truncate ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                           {notif.title}
                         </h3>
                         <span className="text-sm md:text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
                           {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </span>
                      </div>
                      
                      <p className={`text-sm leading-relaxed mb-4 ${notif.isRead ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                        {notif.message}
                      </p>
                      
                      {!notif.isRead && (
                        <button 
                          onClick={() => markAsRead(notif._id)}
                          className="flex items-center gap-1.5 text-sm md:text-xs font-bold text-[#C49E40] uppercase tracking-wider hover:text-[#b38f3a] transition-colors"
                        >
                          <Check size={14} /> Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
