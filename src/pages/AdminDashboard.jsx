import { motion, AnimatePresence } from 'framer-motion';

import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  FileText, 
  Video, 
  ShieldAlert, 
  Briefcase,
  Bell,
  Film,
  Gauge,
  Menu,
  X,
  Leaf
} from 'lucide-react';

import AdminTelemetry from './admin/AdminTelemetry';
import AdminUsers from './admin/AdminUsers';
import AdminZones from './admin/AdminZones';
import AdminBills from './admin/AdminBills';
import AdminForm16 from './admin/AdminForm16';
import AdminLiveStreams from './admin/AdminLiveStreams';
import AdminManagement from './admin/AdminManagement';
import AdminLogs from './admin/AdminLogs';
import AdminNotifications from './admin/AdminNotifications';
import AdminProjects from './admin/AdminProjects';
import AdminPlots from './admin/AdminPlots';

const AdminDashboard = () => {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { name: 'Live Telemetry', path: '/admin', icon: <Gauge size={20} />, exact: true },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Zones', path: '/admin/zones', icon: <MapPin size={20} /> },
    { name: 'Bills', path: '/admin/bills', icon: <FileText size={20} /> },
    { name: 'Form 16', path: '/admin/form16', icon: <FileText size={20} /> },
    { name: 'Live Streams', path: '/admin/live-streams', icon: <Video size={20} /> },
    { name: 'Management', path: '/admin/management', icon: <Briefcase size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <Film size={20} /> },
    { name: 'Plots', path: '/admin/plots', icon: <FileText size={20} /> },
    { name: 'Plant Analyzer', path: '/plant-analyzer', icon: <Leaf size={20} /> },
    { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={20} /> },
    { name: 'Logs', path: '/admin/logs', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <div className="pt-24 px-6 lg:px-12 pb-12 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[75vh]">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 flex-shrink-0">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-gray-900">Admin Panel</h2>
              <p className="text-sm md:text-xs text-gray-500 mt-1">System Management</p>
            </div>
            <button 
              className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            >
              {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <nav className={`p-4 flex-col gap-2 ${isMobileNavOpen ? 'flex' : 'hidden md:flex'}`}>
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
                
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    isActive 
                      ? 'bg-white shadow-sm text-[#C49E40] border border-gray-100' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white relative">
          <Routes>
            <Route path="/" element={<AdminTelemetry />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/zones" element={<AdminZones />} />
            <Route path="/bills" element={<AdminBills />} />
            <Route path="/form16" element={<AdminForm16 />} />
            <Route path="/live-streams" element={<AdminLiveStreams />} />
            <Route path="/management" element={<AdminManagement />} />
            <Route path="/projects" element={<AdminProjects />} />
            <Route path="/plots" element={<AdminPlots />} />
            <Route path="/notifications" element={<AdminNotifications />} />
            <Route path="/logs" element={<AdminLogs />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;



