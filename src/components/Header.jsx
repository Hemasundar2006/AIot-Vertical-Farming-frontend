import React, { useState } from 'react';
import { Leaf, Bell, Settings, LogOut, User, Brain, Menu, X, MessageSquare, Phone, LayoutDashboard, Home, Camera } from 'lucide-react';
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
  const [showPredictionMenu, setShowPredictionMenu] = useState(false);

  const handleLogout = () => {
      logout();
      navigate('/login');
      setShowProfileMenu(false);
  };

  const navLinks = [
      { name: 'Home', path: '/', icon: Home, showAlways: true },
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, showAlways: true },
      { name: 'Image Detection', path: '/image-detection', icon: Camera, showAlways: true },
      { name: 'AI Chatbot', path: '/chatbot', icon: MessageSquare, showAlways: true },
      { name: 'ML Predictions', path: '/predictions', icon: Brain, showAlways: true },
      { name: 'Contact', path: '/contact', icon: Phone, showAlways: true },
  ];

  const handleNav = (path) => {
      navigate(path);
      setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-earth-800 via-earth-700 to-earth-800 backdrop-blur-md border-b-2 border-earth-600/50 shadow-farm-lg h-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(107, 78, 61, 0.15) 2px, rgba(107, 78, 61, 0.15) 4px)' }}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 h-full max-w-7xl mx-auto">
        
        {/* Logo - Enhanced Rustic farmer theme */}
        <motion.div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
            <div className="relative bg-gradient-to-br from-earth-600 to-earth-800 p-2.5 rounded-xl shadow-rustic group-hover:shadow-farm transition-all duration-300 group-hover:scale-110 border-2 border-earth-500/40 overflow-hidden">
                <Leaf className="text-harvest-200 relative z-10" size={28} />
                <div className="absolute inset-0 bg-harvest-500/20 rounded-xl group-hover:bg-harvest-500/30 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
            <h1 className="text-2xl font-black text-harvest-100 tracking-tight group-hover:text-harvest-50 transition-colors">
                <span className="text-harvest-300 group-hover:text-harvest-200 transition-colors">Agri</span><span className="text-harvest-100">Nex</span>
            </h1>
            <p className="text-[9px] text-harvest-200/70 font-bold uppercase tracking-widest -mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Smart Farm</p>
            </div>
        </motion.div>

        {/* Desktop Navigation - Enhanced with animations */}
        <nav className="hidden md:flex items-center gap-1.5 relative">
          {navLinks.filter((l) => l.showAlways).map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <motion.button
                key={link.name}
                onClick={() => handleNav(link.path)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden',
                  isActive 
                    ? 'bg-harvest-500/40 text-harvest-50 shadow-farm border-2 border-harvest-400/50' 
                    : 'text-harvest-200/90 hover:text-harvest-100 hover:bg-harvest-600/25 hover:border-harvest-500/40 border-2 border-transparent'
                )}
              >
                <div className={clsx(
                  'absolute inset-0 bg-gradient-to-r from-harvest-500/20 to-transparent opacity-0 transition-opacity',
                  isActive ? 'opacity-100' : 'group-hover:opacity-100'
                )} />
                <Icon size={18} className="relative z-10" />
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-harvest-300"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}

          {/* Crop Layout dropdown - Enhanced with animations */}
          <div className="relative">
            <motion.button
              onClick={() => setShowPredictionMenu((prev) => !prev)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden',
                location.pathname === '/horizontal-farming' || location.pathname === '/vertical-farming'
                  ? 'bg-harvest-500/40 text-harvest-50 shadow-farm border-2 border-harvest-400/50'
                  : 'text-harvest-200/90 hover:text-harvest-100 hover:bg-harvest-600/25 hover:border-harvest-500/40 border-2 border-transparent'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-harvest-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              <Brain size={18} className="relative z-10" />
              <span className="relative z-10">Crop Layout</span>
              <motion.span 
                className="text-xs relative z-10"
                animate={{ rotate: showPredictionMenu ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </motion.button>
            <AnimatePresence>
              {showPredictionMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute mt-2 w-60 bg-harvest-50/98 backdrop-blur-xl border-2 border-harvest-300/60 rounded-xl shadow-farm-lg py-2 z-50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-harvest-100/60 to-harvest-50/60 pointer-events-none" />
                  <motion.button
                    onClick={() => {
                      handleNav('/horizontal-farming');
                      setShowPredictionMenu(false);
                    }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(212, 165, 116, 0.3)' }}
                    className={clsx(
                      'relative w-full text-left px-4 py-3 text-sm font-bold transition-all flex items-center gap-3 rounded-lg mx-1',
                      location.pathname === '/horizontal-farming' 
                        ? 'text-earth-900 bg-harvest-300/60 shadow-inner' 
                        : 'text-earth-800 hover:bg-harvest-200/40'
                    )}
                  >
                    <span className="text-xl">🌾</span>
                    <span>Horizontal Prediction</span>
                    {location.pathname === '/horizontal-farming' && (
                      <motion.div 
                        className="ml-auto w-2 h-2 rounded-full bg-earth-800"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      handleNav('/vertical-farming');
                      setShowPredictionMenu(false);
                    }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(212, 165, 116, 0.3)' }}
                    className={clsx(
                      'relative w-full text-left px-4 py-3 text-sm font-bold transition-all flex items-center gap-3 rounded-lg mx-1',
                      location.pathname === '/vertical-farming' 
                        ? 'text-earth-900 bg-harvest-300/60 shadow-inner' 
                        : 'text-earth-800 hover:bg-harvest-200/40'
                    )}
                  >
                    <span className="text-xl">🌱</span>
                    <span>Vertical Prediction</span>
                    {location.pathname === '/vertical-farming' && (
                      <motion.div 
                        className="ml-auto w-2 h-2 rounded-full bg-earth-800"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Side Actions - Enhanced */}
        <div className="flex items-center gap-2 sm:gap-3">
           {/* System Status Indicator - Enhanced */}
           <motion.div 
             className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-harvest-600/25 backdrop-blur-sm border-2 border-harvest-500/40 shadow-rustic"
             whileHover={{ scale: 1.05 }}
           >
               <motion.div 
                 className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-harvest-400' : 'bg-red-500'}`}
                 animate={isConnected ? { 
                   scale: [1, 1.2, 1],
                   opacity: [1, 0.7, 1]
                 } : {}}
                 transition={{ duration: 2, repeat: Infinity }}
               />
               <span className="text-xs font-black text-harvest-100">
                 {isConnected ? 'Live' : 'Offline'}
               </span>
           </motion.div>

           {/* Desktop Auth Buttons - Enhanced */}
           {!user && (
               <div className="hidden md:flex items-center gap-3">
                   <motion.button 
                       onClick={() => handleNav('/register')}
                       whileHover={{ scale: 1.05, y: -1 }}
                       whileTap={{ scale: 0.95 }}
                       className="bg-gradient-to-br from-harvest-500 to-harvest-600 text-earth-900 px-6 py-2.5 rounded-xl text-sm font-black shadow-rustic hover:shadow-farm transition-all border-2 border-harvest-400/50 relative overflow-hidden group"
                   >
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                       <span className="relative z-10">Get Started</span>
                   </motion.button>
               </div>
           )}

           {user && (
               <div className="relative hidden md:block">
                    <motion.button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 focus:outline-none group"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-harvest-500 to-harvest-600 border-2 border-harvest-300/50 flex items-center justify-center text-sm font-black text-earth-900 shadow-rustic group-hover:shadow-farm transition-all relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                    </motion.button>

                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-60 bg-harvest-50/98 backdrop-blur-xl border-2 border-harvest-300/60 rounded-xl shadow-farm-lg py-2 z-50 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-harvest-100/60 to-harvest-50/60 pointer-events-none" />
                            <div className="relative px-4 py-3 border-b border-harvest-200/60 mb-1">
                                <p className="text-sm font-black text-earth-900 truncate">{user.name}</p>
                                <p className="text-xs text-earth-700 truncate font-medium">{user.email}</p>
                            </div>
                            <motion.button 
                              className="relative w-full text-left px-4 py-2.5 text-sm font-bold text-earth-800 hover:bg-harvest-200/50 transition-all flex items-center gap-2 rounded-lg mx-1"
                              whileHover={{ x: 4 }}
                            >
                                <Settings size={16} /> Settings
                            </motion.button>
                            <motion.button 
                                onClick={handleLogout}
                                className="relative w-full text-left px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 transition-all flex items-center gap-2 rounded-lg mx-1"
                                whileHover={{ x: 4 }}
                            >
                                <LogOut size={16} /> Logout
                            </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
               </div>
           )}

           {/* Mobile Menu Button - Enhanced */}
           <motion.button 
                className="md:hidden text-harvest-200 hover:text-harvest-100 p-2 rounded-lg hover:bg-harvest-600/20 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
           >
               <motion.div
                 animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                 transition={{ duration: 0.3 }}
               >
                 {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </motion.div>
           </motion.button>
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
                className="md:hidden fixed inset-0 top-20 z-40 bg-white border-t-2 border-earth-200 flex flex-col overflow-y-auto shadow-2xl"
            >
                {/* Header Section - Light beige with brown text */}
                {/* <div className="bg-earth-50 border-b border-earth-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-earth-600 to-earth-800 rounded-lg">
                            <Leaf className="text-harvest-200" size={24} />
                        </div>
                        <h2 className="text-xl font-black text-earth-900">AgriNex</h2>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 hover:bg-earth-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-earth-800" />
                    </button>
                </div> */}

                <div className="p-6 flex flex-col gap-3 bg-white">
                    {navLinks.map((link, index) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <motion.button
                                key={link.name}
                                onClick={() => handleNav(link.path)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={clsx(
                                    "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group text-left relative overflow-hidden",
                                    isActive 
                                        ? "bg-earth-100 text-earth-900 shadow-md border-2 border-earth-300" 
                                        : "hover:bg-earth-50 text-earth-800 hover:text-earth-900 border-2 border-transparent"
                                )}
                            >
                                <div className={clsx(
                                    "p-2.5 rounded-xl transition-colors relative z-10",
                                    isActive ? "bg-earth-200" : "bg-earth-100"
                                )}>
                                    <Icon size={22} className={isActive ? "text-earth-900" : "text-earth-700"} />
                                </div>
                                <div className="relative z-10">
                                    <span className={clsx(
                                        "block text-lg font-black",
                                        isActive ? "text-earth-900" : "text-earth-800"
                                    )}>{link.name}</span>
                                </div>
                                {isActive && (
                                    <motion.div 
                                      className="ml-auto relative z-10"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full bg-earth-700 shadow-lg" />
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}

                    {/* Mobile entries for Crop Layout predictions */}
                    <motion.button
                      onClick={() => handleNav('/horizontal-farming')}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        'flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group text-left relative overflow-hidden',
                        location.pathname === '/horizontal-farming'
                          ? 'bg-earth-100 text-earth-900 shadow-md border-2 border-earth-300'
                          : 'hover:bg-earth-50 text-earth-800 hover:text-earth-900 border-2 border-transparent'
                      )}
                    >
                      <div className={clsx(
                        "p-2.5 rounded-xl relative z-10",
                        location.pathname === '/horizontal-farming' ? "bg-earth-200" : "bg-earth-100"
                      )}>
                        <Brain size={22} className={location.pathname === '/horizontal-farming' ? "text-earth-900" : "text-earth-700"} />
                      </div>
                      <div className="relative z-10">
                        <span className={clsx(
                          "block text-lg font-black",
                          location.pathname === '/horizontal-farming' ? "text-earth-900" : "text-earth-800"
                        )}>🌾 Horizontal Prediction</span>
                      </div>
                      {location.pathname === '/horizontal-farming' && (
                        <motion.div 
                          className="ml-auto relative z-10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-earth-700 shadow-lg" />
                        </motion.div>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={() => handleNav('/vertical-farming')}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + 1) * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        'flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group text-left relative overflow-hidden',
                        location.pathname === '/vertical-farming'
                          ? 'bg-earth-100 text-earth-900 shadow-md border-2 border-earth-300'
                          : 'hover:bg-earth-50 text-earth-800 hover:text-earth-900 border-2 border-transparent'
                      )}
                    >
                      <div className={clsx(
                        "p-2.5 rounded-xl relative z-10",
                        location.pathname === '/vertical-farming' ? "bg-earth-200" : "bg-earth-100"
                      )}>
                        <Brain size={22} className={location.pathname === '/vertical-farming' ? "text-earth-900" : "text-earth-700"} />
                      </div>
                      <div className="relative z-10">
                        <span className={clsx(
                          "block text-lg font-black",
                          location.pathname === '/vertical-farming' ? "text-earth-900" : "text-earth-800"
                        )}>🌱 Vertical Prediction</span>
                      </div>
                      {location.pathname === '/vertical-farming' && (
                        <motion.div 
                          className="ml-auto relative z-10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-earth-700 shadow-lg" />
                        </motion.div>
                      )}
                    </motion.button>
                    
                    {/* Divider */}
                    <motion.div 
                      className="h-px bg-earth-200 my-3"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3 }}
                    />

                    {!user ? (
                        <motion.button 
                            onClick={() => handleNav('/register')}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-xl bg-gradient-to-br from-harvest-500 to-harvest-600 text-earth-900 font-black shadow-rustic hover:shadow-farm transition-all text-center text-lg border-2 border-harvest-400/50 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <span className="relative z-10">Get Started</span>
                        </motion.button>
                    ) : (
                        <motion.div 
                          className="bg-earth-50 rounded-xl p-4 border-2 border-earth-200 shadow-md"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-harvest-500 to-harvest-600 flex items-center justify-center text-earth-900 font-black text-xl shadow-rustic border-2 border-harvest-400/50 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                    <span className="relative z-10">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                                </div>
                                <div>
                                    <p className="font-black text-earth-900 text-lg">{user.name}</p>
                                    <p className="text-earth-700 text-sm font-medium">{user.email}</p>
                                </div>
                            </div>
                            <motion.button 
                                onClick={handleLogout}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 bg-red-100 text-red-700 border-2 border-red-300 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-red-200 transition-colors shadow-sm"
                            >
                                <LogOut size={18} /> Sign Out
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
