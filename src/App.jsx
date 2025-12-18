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
import { Toaster } from 'react-hot-toast';

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // Or a loading spinner
    return user ? children : <Navigate to="/login" />;
};

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-farm-accent/30 selection:text-emerald-200">
            <Header />
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
             {/* Background ambient lighting effects */}
             <div className="fixed top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
             <div className="fixed bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FarmProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/" 
                    element={
                        <PrivateRoute>
                            <DashboardLayout />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/predictions" 
                    element={
                        <PrivateRoute>
                           <div>
                                <Header /> {/* Add Head here since DashboardLayout has it hardcoded, or refactor. Better to wrap Predictions in a layout or just add Header manually here for now */}
                                <MLPredictions />
                           </div>
                        </PrivateRoute>
                    } 
                />
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
