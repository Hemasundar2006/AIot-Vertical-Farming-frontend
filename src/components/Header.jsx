import React, { useState } from 'react';
import { Leaf, Bell, Settings, LogOut, User, Brain, Menu, X, MessageSquare, Phone, LayoutDashboard, Home } from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { isConnected, isDemoMode } = useFarm();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
      logout();
      navigate('/login');
      setShowProfileMenu(false);
  };

  const navLinks = [
      { name: 'Home', path: '/', icon: Home, showAlways: true },
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, showAlways: true },
      { name: 'AI Chatbot', path: '/chatbot', icon: MessageSquare, showAlways: true },
      { name: 'ML Predictions', path: '/predictions', icon: Brain, showAlways: true },
      { name: 'Contact', path: '/contact', icon: Phone, showAlways: true },
  ];

  const handleNav = (path) => {
      navigate(path);
      setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 p-8 right-0 z-50 bg-[#688557]/95 backdrop-blur-md border-b border-white/20 h-16">
      <div className="flex items-center justify-between px-6 lg:px-12 h-full">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <Leaf color="white" size={24} />
            </div>
            <div>
            <h1 className="text-xl font-bold text-green-300 tracking-wide">A<span className="text-white">gri<span className="text-green-300">N<span className="text-white">ex</span></span></span></h1>
            </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
            {navLinks.filter(l => l.showAlways).map((link) => (
                <button
                    key={link.name}
                    onClick={() => handleNav(link.path)}
                    className={clsx(
                        "text-sm font-medium transition-colors hover:text-white",
                        location.pathname === link.path ? "text-white font-bold" : "text-emerald-100/80"
                    )}
                >
                    {link.name}
                </button>
            ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
           {/* System Status Indicator (Hidden on small mobile) */}
           <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
               <span className="text-xs font-medium text-slate-300">
                 {isConnected ? 'Online' : 'Offline'}
               </span>
           </div>

           {/* Desktop Auth Buttons */}
           {!user && (
               <div className="hidden md:flex items-center gap-4">
                   <button 
                       onClick={() => handleNav('/register')}
                       className="bg-white text-[#688557] px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-emerald-50 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                   >
                       Get Started
                   </button>
               </div>
           )}

           {user && (
               <div className="relative hidden md:block">
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 focus:outline-none"
                    >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                            <div className="px-4 py-2 border-b border-slate-700 mb-1">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
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
           )}

           {/* Mobile Menu Button */}
           <button 
                className="md:hidden text-slate-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           >
               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: '100vh' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden fixed inset-0 top-16 z-40 bg-[#688557] border-t border-white/10 flex flex-col overflow-y-auto"
            >
                <div className="p-6 flex flex-col gap-4">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <button
                                key={link.name}
                                onClick={() => handleNav(link.path)}
                                className={clsx(
                                    "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group text-left",
                                    isActive 
                                        ? "bg-white text-[#688557] shadow-lg translate-x-2" 
                                        : "hover:bg-white/10 text-emerald-50 hover:translate-x-1"
                                )}
                            >
                                <div className={clsx(
                                    "p-2 rounded-xl transition-colors",
                                    isActive ? "bg-[#688557]/10" : "bg-white/5"
                                )}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <span className="block text-lg font-bold">{link.name}</span>

                                </div>
                                {isActive && (
                                    <div className="ml-auto">
                                        <div className="w-2 h-2 rounded-full bg-[#688557] animate-pulse" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                    
                    {/* Divider */}
                    <div className="h-px bg-white/10 my-2" />

                    {!user ? (
                        <button 
                            onClick={() => handleNav('/register')}
                            className="w-full py-4 rounded-2xl bg-white text-[#688557] font-bold shadow-lg hover:bg-emerald-50 transition-colors text-center text-lg"
                        >
                            Get Started
                        </button>
                    ) : (
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg">{user.name}</p>
                                    <p className="text-emerald-200/60 text-sm">{user.email}</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-full py-3 bg-red-500/10 text-red-200 border border-red-500/20 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
