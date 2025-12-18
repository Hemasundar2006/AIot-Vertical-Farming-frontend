import React, { useState } from 'react';
import { Leaf, Bell, Settings, LogOut, User } from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isConnected, isDemoMode } = useFarm();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6 lg:px-12">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-gradient-to-br from-farm-accent to-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
          <Leaf color="white" size={24} />
        </div>
        <div>
           <h1 className="text-xl font-bold text-white tracking-wide">Vertical<span className="text-farm-accent">Grow</span></h1>
           <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">AIoT Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
           <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
           <span className="text-xs font-medium text-slate-300">
             {isConnected ? 'System Online' : 'System Offline'}
           </span>
           {isDemoMode && <span className="text-xs text-yellow-500 ml-1">(Demo Mode)</span>}
        </div>

        <div className="flex items-center gap-4">
           <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
             <Bell size={20} />
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
           </button>
           
           <div className="relative">
             <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 focus:outline-none"
             >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{user?.name || 'Farm Manager'}</p>
                    <p className="text-xs text-slate-400">Admin</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
                </div>
             </button>

             {showProfileMenu && (
                 <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                     <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2">
                         <Settings size={16} /> Settings
                     </button>
                     <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center gap-2"
                     >
                         <LogOut size={16} /> Logout
                     </button>
                 </div>
             )}
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
