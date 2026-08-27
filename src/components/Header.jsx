import React, { useState } from 'react';
import { Leaf, LogOut, Menu, X, LayoutDashboard, Home, MessageSquare, Phone, Brain, Receipt, Microscope } from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const { isConnected, isDemoMode } = useFarm();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowProfileMenu(false);
    };

    const loggedOutLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Management', path: '/management' },
        { name: 'Projects', path: '/projects' },
        { name: 'Contact', path: '/contact' },
    ]

    const loggedInLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'ML Predictions', path: '/predictions' },
        { name: 'Plant Analyzer', path: '/plant-analyzer', icon: Microscope },
        { name: 'Market Rates', path: '/market-rates' },
        { name: 'AI Chatbot', path: '/chatbot' },
        { name: 'Bills', path: '/bills', icon: Receipt },
    ];

    const navLinks = user ? loggedInLinks : loggedOutLinks;

    const handleNav = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="fixed top-6 left-0 right-0 z-50 pointer-events-none px-4 transition-all duration-300">
            <div className="pointer-events-auto flex items-center justify-between px-8 py-3 max-w-6xl mx-auto bg-transparent backdrop-blur-md rounded-full shadow-lg animate-sky-border">

                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <div className="w-8 h-8 bg-[#213E20] rounded flex items-center justify-center shadow-sm">
                        <Leaf className="text-white" size={18} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-serif font-black text-gray-900 tracking-[0.2em] leading-none">
                            AGRINEX
                        </h1>
                        <span className="text-[0.55rem] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">
                            Smart Farming & AI
                        </span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path || (link.path === '/predictions' && location.pathname.includes('prediction'));
                        return (
                            <button
                                key={link.name}
                                onClick={() => handleNav(link.path)}
                                className={`text-[11px] font-bold tracking-[0.1em] transition-all uppercase flex flex-col items-center ${isActive
                                    ? 'text-[#C49E40]'
                                    : 'text-gray-700 hover:text-gray-900'
                                    }`}
                            >
                                {link.icon ? (
                                    <div className="flex items-center gap-1.5">
                                        <link.icon size={14} />
                                        {link.name}
                                    </div>
                                ) : (
                                    link.name
                                )}
                                <div className={`h-[2px] w-6 mt-1 rounded-full transition-all ${isActive ? 'bg-[#C49E40]' : 'bg-transparent'}`} />
                            </button>
                        );
                    })}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    {/* System Status Indicator (Only shown when logged in) */}
                    {user && (
                        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-300 shadow-sm">
                            <span className="text-[11px] font-bold tracking-wider uppercase text-gray-800">
                                {isConnected ? 'LIVE' : 'OFFLINE'}
                            </span>
                        </div>
                    )}

                    {/* Auth */}
                    {!user ? (
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={() => handleNav('/login')}
                                className="text-[11px] font-bold tracking-wider uppercase px-4 py-2 text-gray-700 hover:text-[#C49E40] transition-colors"
                            >
                                SIGN IN
                            </button>
                            <button
                                onClick={() => handleNav('/register')}
                                className="bg-[#C49E40] text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-[#b38f3a] transition-colors shadow-md"
                            >
                                SIGN UP
                            </button>
                        </div>
                    ) : (
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center justify-center h-10 w-10 rounded-full bg-[#C99D3B] text-white shadow-md text-sm font-bold border-2 border-white hover:bg-[#B0862C] transition-colors"
                            >
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                                    <div className="px-5 py-3 border-b border-gray-50">
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut size={14} /> SIGN OUT
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-gray-800 p-2 bg-white/50 rounded-full shadow-sm"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden pointer-events-auto absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl flex flex-col z-40 overflow-hidden">
                    <div className="p-2 flex flex-col">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNav(link.path)}
                                className="px-6 py-4 text-center text-xs font-bold tracking-wider uppercase text-gray-700 hover:bg-gray-50 hover:text-[#C99D3B] border-b border-gray-100 last:border-0 flex items-center justify-center gap-2"
                            >
                                {link.icon && <link.icon size={16} />}
                                {link.name}
                            </button>
                        ))}

                        {!user ? (
                            <div className="flex flex-col p-4 gap-3 bg-gray-50/50">
                                <button
                                    onClick={() => handleNav('/login')}
                                    className="py-3 text-center text-gray-700 font-bold uppercase tracking-wider text-xs hover:text-[#C99D3B]"
                                >
                                    SIGN IN
                                </button>
                                <button
                                    onClick={() => handleNav('/register')}
                                    className="py-3 text-center bg-[#C99D3B] text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-md"
                                >
                                    SIGN UP
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 bg-red-50 text-red-600 rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <LogOut size={16} /> SIGN OUT
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
