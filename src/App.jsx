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
import Dashboard from './pages/Dashboard';
import SensorData from './pages/SensorData';
import ImageDetection from './pages/ImageDetection';
import ZoneControl from './pages/ZoneControl';
import DataDownload from './pages/DataDownload';
import Video360 from './pages/Video360';
import WeatherMonitoring from './pages/WeatherMonitoring';
import MarketPrediction from './pages/MarketPrediction';
import BillDashboard from './pages/BillDashboard';
import UtilityBillForm from './pages/UtilityBillForm';
import HarvestBillForm from './pages/HarvestBillForm';
import MarketRates from './pages/MarketRates';
import About from './pages/About';
import Management from './pages/Management';
import Projects from './pages/Projects';
import PlantAnalyzer from './pages/PlantAnalyzer';


// ... (other imports remain, but reusing existing block structure to minimize diff)

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; 
    return user ? children : <Navigate to="/login" />;
};

const MainLayout = ({ children }) => {
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
                    <a href="/chatbot" className="bg-[#C49E40] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-[#b38f3a] hover:-translate-y-1 transition-all flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                    </a>
                </div>
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

                {/* Private Dashboard */}
                <Route path="/dashboard" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
                
                <Route path="/predictions" element={<PrivateRoute><MainLayout><MLPredictions /></MainLayout></PrivateRoute>} />
                <Route path="/smart-prediction" element={<PrivateRoute><MainLayout><SmartFarmingPrediction /></MainLayout></PrivateRoute>} />
                <Route path="/horizontal-farming" element={<PrivateRoute><MainLayout><HorizontalFarming /></MainLayout></PrivateRoute>} />
                <Route path="/vertical-farming" element={<PrivateRoute><MainLayout><VerticalFarming /></MainLayout></PrivateRoute>} />
                <Route path="/sensor-data" element={<PrivateRoute><MainLayout><SensorData /></MainLayout></PrivateRoute>} />
                <Route path="/image-detection" element={<MainLayout><ImageDetection /></MainLayout>} />
                <Route path="/plant-analyzer" element={<PrivateRoute><MainLayout><PlantAnalyzer /></MainLayout></PrivateRoute>} />
                <Route path="/chatbot" element={<MainLayout><ChatBot /></MainLayout>} />
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
