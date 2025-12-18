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
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
            <img 
                src="/vertical_farm_background_lush.png" 
                alt="Vertical Farm Background" 
                className="w-full h-full object-cover"
            />
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

      <div className="w-full max-w-md z-10 px-4">
        {/* Glassmorphism Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            {/* Glossy Reflection Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2 text-[#2d4a22]">
                         <Leaf size={28} />
                         <span className="text-xl font-bold">AIoT Smart Vertical Farming</span>
                    </div>
                
                    <h2 className="text-3xl font-bold text-slate-800">Sign In</h2>
                    <p className="text-slate-600 mt-2 text-sm max-w-xs mx-auto">
                        Welcome back! Sign in to access your smart vertical farm.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-4 bg-white/60 border border-white/50 rounded-xl focus:ring-2 focus:ring-[#688557] focus:border-transparent text-slate-900 placeholder-slate-500 transition-all font-medium backdrop-blur-sm"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                </div>

                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                         className="block w-full pl-11 pr-12 py-4 bg-white/60 border border-white/50 rounded-xl focus:ring-2 focus:ring-[#688557] focus:border-transparent text-slate-900 placeholder-slate-500 transition-all font-medium backdrop-blur-sm"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-slate-500 hover:text-slate-700 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>
                </div>

                <div className="flex items-center justify-end text-sm">
                    <a href="#" className="text-slate-600 hover:text-[#5a744b] font-medium transition-colors">Forgot password?</a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-[#3e5233] hover:bg-[#2d3b25] transition-all transform hover:scale-[1.02]"
                >
                    {isLoading ? (
                        <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                
                <button type="button" className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                   <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                   Continue with Google
                </button>

                <p className="mt-8 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-[#3e5233] hover:underline transition-colors">
                    Sign Up &gt;
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
