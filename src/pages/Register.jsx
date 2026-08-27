import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, User, Phone, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
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
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-agri-light">

      <div className="w-full max-w-[500px] z-10 px-4 py-8">
        {/* Enhanced Glassmorphism Card */}
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-white/50 p-8 lg:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
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
                
                    <h2 className="text-3xl font-black text-agri-dark mb-2">Create your Agrinex account</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-gold focus:border-agri-gold text-gray-900 placeholder-gray-400 transition-all font-medium shadow-sm hover:shadow-md"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                </div>

                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Leaf className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-gold focus:border-agri-gold text-gray-900 placeholder-gray-400 transition-all font-medium shadow-sm hover:shadow-md"
                        placeholder="Farm Location"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                    />
                    </div>
                </div>

                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-gold focus:border-agri-gold text-gray-900 placeholder-gray-400 transition-all font-medium shadow-sm hover:shadow-md"
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
                         className="block w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-gold focus:border-agri-gold text-gray-900 placeholder-gray-400 transition-all font-medium shadow-sm hover:shadow-md"
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

                <div>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                         className="block w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-gold focus:border-agri-gold text-gray-900 placeholder-gray-400 transition-all font-medium shadow-sm hover:shadow-md"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-sm tracking-wider uppercase font-bold text-white bg-agri-gold hover:bg-[#b38f3a] transition-all transform hover:-translate-y-1 mt-6"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Sign Up'
                    )}
                </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-agri-dark hover:text-agri-gold hover:underline transition-colors">
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
