import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FarmProvider } from './context/FarmContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import PoleOverview from './components/PoleOverview';
import ControlCenter from './components/ControlCenter';
import MoistureChart from './components/MoistureChart';
import Login from './pages/Login';
import Register from './pages/Register';
import MLPredictions from './pages/Predictions';
import SmartFarmingPrediction from './pages/SmartFarmingPrediction';
import HorizontalFarming from './pages/HorizontalFarming';
import VerticalFarming from './pages/VerticalFarming';
import Contact from './pages/Contact';
import ChatBot from './pages/ChatBot';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

import Home from './pages/Home';
import MyFarm from './pages/MyFarm.jsx';
import SensorData from './pages/SensorData';
import ImageDetection from './pages/ImageDetection';
import ZoneControl from './pages/ZoneControl';
import DataDownload from './pages/DataDownload';
import Video360 from './pages/Video360';
import WeatherMonitoring from './pages/WeatherMonitoring';
import MarketPrediction from './pages/MarketPrediction';
import BillDashboard from './pages/BillDashboard';
import MarketRates from './pages/MarketRates';
import About from './pages/About';
import Management from './pages/Management';
import Projects from './pages/Projects';
import Notifications from './pages/Notifications';
import PlantAnalyzer from './pages/PlantAnalyzer';
import AdminDashboard from './pages/AdminDashboard'; // NEW IMPORT
import UtilityBillForm from './pages/UtilityBillForm';
import HarvestBillForm from './pages/HarvestBillForm';
import UnifiedChat from './components/UnifiedChat';
import { MessageSquare, X } from 'lucide-react';

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; 
    return user ? children : <Navigate to="/login" />;
};

const MainLayout = ({ children }) => {
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    
    React.useEffect(() => {
        const toggleChat = () => setIsChatOpen(prev => !prev);
        window.addEventListener('toggle-chatbot', toggleChat);
        return () => window.removeEventListener('toggle-chatbot', toggleChat);
    }, []);

    return (
        <div className="min-h-screen text-gray-900 relative bg-agri-light overflow-x-hidden">
            {/* Floating background orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden fixed z-0">
                <motion.div
                    className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-[#C49E40]/10 blur-3xl"
                    animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-20 -right-32 w-[480px] h-[480px] rounded-full bg-[#213E20]/5 blur-3xl"
                    animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>
            
            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                {children}
                
                {/* Floating Chatbot Bubble */}
                <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end group">
                    <div className="absolute right-0 bottom-16 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto origin-bottom-right transform scale-95 group-hover:scale-100">
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">
                            Ask Agrinex anything — from watering schedules to market prices.
                        </p>
                        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b border-r border-gray-200 transform rotate-45"></div>
                    </div>
                    <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-[#C49E40] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-[#b38f3a] hover:-translate-y-1 transition-all flex items-center justify-center">
                        <MessageSquare size={24} />
                    </button>
                </div>
                
                {/* Chat Modal */}
                {isChatOpen && (
                    <div className="fixed bottom-24 right-6 w-[calc(100vw-48px)] max-w-md h-[600px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[60] flex flex-col overflow-hidden animate-slide-in-up">
                         <div className="bg-[#1F3B21] text-white p-4 flex justify-between items-center shadow-md z-10">
                             <h3 className="font-bold flex items-center gap-2"><MessageSquare size={18} /> Agrinex Assistant</h3>
                             <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-[#C49E40] transition-colors p-1"><X size={20} /></button>
                         </div>
                         <div className="flex-1 overflow-hidden relative bg-[#f0f7f4]">
                             <UnifiedChat />
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DashboardContent = () => {
    return (
        <main className="pt-24 px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-8">
                    <PoleOverview />
                </div>
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="h-[400px]">
                        <MoistureChart />
                    </div>
                    <div>
                        <ControlCenter />
                    </div>
                </div>
            </div>
        </main>
    );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FarmProvider>
            <Routes>
                {/* Routes with Main Layout (Header + Content) */}
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
                <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
                <Route path="/about" element={<MainLayout><About /></MainLayout>} />
                <Route path="/management" element={<MainLayout><Management /></MainLayout>} />
                <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />

                {/* Private Dashboard Removed */}
                
                <Route path="/predictions" element={<PrivateRoute><MainLayout><MLPredictions /></MainLayout></PrivateRoute>} />
                <Route path="/smart-prediction" element={<PrivateRoute><MainLayout><SmartFarmingPrediction /></MainLayout></PrivateRoute>} />
                <Route path="/horizontal-farming" element={<PrivateRoute><MainLayout><HorizontalFarming /></MainLayout></PrivateRoute>} />
                <Route path="/vertical-farming" element={<PrivateRoute><MainLayout><VerticalFarming /></MainLayout></PrivateRoute>} />
                <Route path="/sensor-data" element={<PrivateRoute><MainLayout><SensorData /></MainLayout></PrivateRoute>} />
                <Route path="/image-detection" element={<MainLayout><ImageDetection /></MainLayout>} />
                <Route path="/plant-analyzer" element={<PrivateRoute><MainLayout><PlantAnalyzer /></MainLayout></PrivateRoute>} />
                <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
                <Route path="/zone-control" element={<PrivateRoute><MainLayout><ZoneControl /></MainLayout></PrivateRoute>} />
                <Route path="/data-download" element={<PrivateRoute><MainLayout><DataDownload /></MainLayout></PrivateRoute>} />
                <Route path="/video-360" element={<PrivateRoute><MainLayout><Video360 /></MainLayout></PrivateRoute>} />
                <Route path="/weather-monitoring" element={<PrivateRoute><MainLayout><WeatherMonitoring /></MainLayout></PrivateRoute>} />
                <Route path="/market-prediction" element={<PrivateRoute><MainLayout><MarketPrediction /></MainLayout></PrivateRoute>} />
                <Route path="/bills" element={<PrivateRoute><MainLayout><BillDashboard /></MainLayout></PrivateRoute>} />
                <Route path="/bills/utility/new" element={<PrivateRoute><MainLayout><UtilityBillForm /></MainLayout></PrivateRoute>} />
                <Route path="/bills/harvest/new" element={<PrivateRoute><MainLayout><HarvestBillForm /></MainLayout></PrivateRoute>} />
                <Route path="/market-rates" element={<MainLayout><MarketRates /></MainLayout>} />
                <Route path="/notifications" element={<PrivateRoute><MainLayout><Notifications /></MainLayout></PrivateRoute>} />
                <Route path="/my-farm" element={<PrivateRoute><MainLayout><MyFarm /></MainLayout></PrivateRoute>} />

                {/* NEW ADMIN ROUTE */}
                <Route path="/admin/*" element={<PrivateRoute><MainLayout><AdminDashboard /></MainLayout></PrivateRoute>} />
            </Routes>

            <Toaster 
                position="top-right"
                toastOptions={{
                    style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155',
                    },
                    success: {
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                    },
                    },
                    error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    }
                    }
                }}
            />
        </FarmProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;



