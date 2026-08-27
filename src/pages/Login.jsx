import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-agri-light">

      <div className="w-full max-w-md z-10 px-4">
        {/* Enhanced Glassmorphism Card */}
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-white/50 p-8 lg:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden animate-glow-border">
            {/* Enhanced Glossy Reflection Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-agri-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                         <div className="p-3 bg-agri-dark rounded-lg shadow-sm">
                            <Leaf size={32} className="text-white" />
                         </div>
                         <div className="text-left">
                            <span className="text-xl font-black text-agri-dark block tracking-widest uppercase">AgriNex</span>
                         </div>
                    </div>
                
                    <h2 className="text-3xl font-black text-agri-dark mb-2">Welcome Back</h2>
                    <p className="text-gray-600 mt-2 text-sm max-w-xs mx-auto font-medium">
                        Welcome back — track your farm from anywhere.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-gold focus:border-agri-gold text-gray-900 placeholder-gray-400 transition-all font-medium shadow-sm hover:shadow-md"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                </div>

                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                         className="block w-full pl-11 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-gold focus:border-agri-gold text-gray-900 placeholder-gray-400 transition-all font-medium shadow-sm hover:shadow-md"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>
                </div>

                <div className="flex items-center justify-end text-sm">
                    <a href="#" className="text-agri-dark hover:text-agri-gold font-bold transition-colors">Forgot password?</a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-sm tracking-wider uppercase font-bold text-white bg-agri-gold hover:bg-[#b38f3a] transition-all transform hover:-translate-y-1"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Sign In'
                    )}
                </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-slate-300"></div>
                    <span className="px-4 text-xs text-slate-500 uppercase font-medium">or</span>
                    <div className="flex-1 border-t border-slate-300"></div>
                </div>
                
                <button type="button" className="w-full bg-white border-2 border-harvest-200 text-earth-800 font-black py-3.5 rounded-lg hover:bg-harvest-100 hover:border-harvest-300 transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                   <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                   Continue with Google
                </button>

                <p className="mt-8 text-center text-sm text-earth-800 font-bold">
                Don't have an account?{' '}
                <Link to="/register" className="font-black text-earth-900 hover:text-harvest-600 hover:underline transition-colors">
                    Sign Up →
                </Link>
                </p>
            </div>
        </div>
      </div>
      
       {/* Bottom Footer Links */}
       <div className="absolute bottom-6 left-0 w-full text-center z-10 text-xs text-white/60 font-medium">
          <span className="hover:text-white cursor-pointer mx-2">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer mx-2">Terms of Service</span>
       </div>
    </div>
  );
};

export default Login;
