import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, User, Phone, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match"); 
        return;
    }
    setIsLoading(true);
    const success = await register(name, email, password, "Farmer");
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

      <div className="w-full max-w-[500px] z-10 px-4 py-8">
        {/* Enhanced Glassmorphism Card */}
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-white/50 p-8 lg:p-10 rounded-[2.5rem] shadow-farm-lg relative overflow-hidden">
            {/* Enhanced Glossy Reflection Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-harvest-100/30 via-white/20 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-harvest-300/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                         <div className="p-3 bg-gradient-to-br from-harvest-500 to-harvest-600 rounded-lg shadow-rustic border-2 border-harvest-400/40">
                            <Leaf size={32} className="text-earth-900" />
                         </div>
                         <div className="text-left">
                            <span className="text-xl font-black text-earth-900 block">AgriNex</span>
                            <span className="text-xs text-earth-700 font-bold uppercase tracking-wider">Smart Farming</span>
                         </div>
                    </div>
                
                    <h2 className="text-4xl font-black text-earth-900 mb-2">Create Account</h2>
                    <p className="text-earth-800 mt-2 text-base max-w-xs mx-auto font-bold">
                        Join us to manage your smart vertical farm efficiently.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <User className="h-5 w-5 text-earth-600" />
                    </div>
                    <input
                        type="text"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-white/90 border-2 border-harvest-200 rounded-xl focus:ring-2 focus:ring-harvest-400 focus:border-harvest-500 text-earth-900 placeholder-earth-600 transition-all font-bold backdrop-blur-sm shadow-sm hover:shadow-md"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                </div>

                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Mail className="h-5 w-5 text-earth-600" />
                    </div>
                    <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-white/90 border-2 border-harvest-200 rounded-xl focus:ring-2 focus:ring-harvest-400 focus:border-harvest-500 text-earth-900 placeholder-earth-600 transition-all font-bold backdrop-blur-sm shadow-sm hover:shadow-md"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                </div>

                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-earth-600" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                         className="block w-full pl-11 pr-12 py-3.5 bg-white/90 border-2 border-harvest-200 rounded-xl focus:ring-2 focus:ring-harvest-400 focus:border-harvest-500 text-earth-900 placeholder-earth-600 transition-all font-bold backdrop-blur-sm shadow-sm hover:shadow-md"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-earth-600 hover:text-earth-800 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>
                </div>

                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-earth-600" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                         className="block w-full pl-11 pr-12 py-3.5 bg-white/90 border-2 border-harvest-200 rounded-xl focus:ring-2 focus:ring-harvest-400 focus:border-harvest-500 text-earth-900 placeholder-earth-600 transition-all font-bold backdrop-blur-sm shadow-sm hover:shadow-md"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                     <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-earth-600 hover:text-earth-800 focus:outline-none"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 rounded-lg shadow-farm-lg text-lg font-black text-earth-900 bg-gradient-farm hover:shadow-farm transition-all transform hover:scale-105 active:scale-95 mt-2 border-2 border-harvest-400/40"
                >
                    {isLoading ? (
                        <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Sign Up'
                    )}
                </button>
                </form>

                <p className="mt-8 text-center text-sm text-earth-800 font-bold">
                Already have an account?{' '}
                <Link to="/login" className="font-black text-earth-900 hover:text-harvest-600 hover:underline transition-colors">
                    Log In →
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

export default Register;
