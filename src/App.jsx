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
import Contact from './pages/Contact';
import ChatBot from './pages/ChatBot';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

// ... (other imports remain, but reusing existing block structure to minimize diff)

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; 
    return user ? children : <Navigate to="/login" />;
};

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500/30 selection:text-emerald-900">
            <Header />
            {children}
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

                {/* Private Dashboard */}
                <Route path="/dashboard" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
                
                <Route path="/predictions" element={<PrivateRoute><MainLayout><MLPredictions /></MainLayout></PrivateRoute>} />
                <Route path="/chatbot" element={<MainLayout><ChatBot /></MainLayout>} />
                <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
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
