import React, { useState } from 'react';
import { ArrowRight, Sprout, ShieldCheck, Zap, Cloud, Smartphone, BarChart3, Droplets, Leaf, Activity, Sun, Wind, Menu, X, Wifi, CircuitBoard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Animated Text Component for letter-by-letter animation
const AnimatedText = ({ text, delay = 0, className = "", continuous = false }) => {
  const letters = Array.from(text);
  
  return (
    <span className={className}>
      {letters.map((letter, index) => {
        const letterDelay = delay + index * 0.04;
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 30, rotateX: -90 }}
            animate={{ 
              opacity: 1, 
              y: continuous ? [0, -8, 0] : 0, 
              rotateX: 0,
              scale: continuous ? [1, 1.05, 1] : 1,
            }}
            transition={{
              opacity: {
                duration: 0.5,
                delay: letterDelay,
                ease: [0.16, 1, 0.3, 1]
              },
              y: continuous ? {
                duration: 2,
                repeat: Infinity,
                delay: letterDelay + 1,
                ease: "easeInOut"
              } : {
                duration: 0.5,
                delay: letterDelay,
                ease: [0.16, 1, 0.3, 1]
              },
              rotateX: {
                duration: 0.5,
                delay: letterDelay,
                ease: [0.16, 1, 0.3, 1]
              },
              scale: continuous ? {
                duration: 2,
                repeat: Infinity,
                delay: letterDelay + 1,
                ease: "easeInOut"
              } : {
                duration: 0.5,
                delay: letterDelay,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            whileHover={{ 
              scale: 1.2, 
              y: -5,
              transition: { duration: 0.2 }
            }}
            className="inline-block origin-center"
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        );
      })}
    </span>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans bg-slate-50 relative overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* 
        NAVBAR - Responsive & Glassmorphism
      */}
      {/* <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6"> */}
        <div className="max-w-7xl mx-auto flex justify-between items-center">
             {/* Logo */}
             {/* <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white drop-shadow-md">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center text-emerald-100 shadow-inner">
                    <Leaf size={20} />
                </div>
                <span><span className="text-emerald-400">A</span>gri<span className="text-emerald-400">N</span>ex</span>
            </div> */}

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-emerald-100/80">
                <a onClick={() => document.getElementById('how-it-works').scrollIntoView({behavior: 'smooth'})} className="cursor-pointer hover:text-white transition-colors">How it Works</a>
                <a onClick={() => document.getElementById('features').scrollIntoView({behavior: 'smooth'})} className="cursor-pointer hover:text-white transition-colors">Technology</a>
                <button 
                    onClick={() => navigate('/login')}
                    className="px-5 py-2.5 bg-white text-[#688557] rounded-full font-bold hover:bg-emerald-50 transition-all shadow-lg shadow-emerald-900/10"
                >
                    Login
                </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
                className="md:hidden p-2 text-white bg-white/10 backdrop-blur-md rounded-lg border border-white/20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {isMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4 z-50 md:hidden"
                >
                     <a onClick={() => { setIsMenuOpen(false); document.getElementById('how-it-works').scrollIntoView({behavior: 'smooth'}) }} className="text-slate-600 font-bold py-2 border-b border-slate-100">How it Works</a>
                     <a onClick={() => { setIsMenuOpen(false); document.getElementById('features').scrollIntoView({behavior: 'smooth'}) }} className="text-slate-600 font-bold py-2 border-b border-slate-100">Technology</a>
                     <button 
                        onClick={() => navigate('/login')}
                        className="w-full py-3 bg-[#688557] text-white rounded-xl font-bold mt-2"
                    >
                        Login
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      {/* </nav> */}

      {/* 
        HERO SECTION - Enhanced Modern Farmer Theme
        Integration of Organic + Tech Theme
      */}
      <section className="relative bg-gradient-to-br from-harvest-100 via-harvest-50 to-earth-100 pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 overflow-hidden">
        
        {/* Organic Pattern Overlay */}
        <div className="absolute inset-0 pattern-organic opacity-20" />
        
        {/* Tech Grid Overlay - Subtle */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(107, 78, 61, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(107, 78, 61, 0.1) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
        </div>
        
        {/* Floating Ambient Lights - Enhanced */}
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-harvest-300/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-earth-300/15 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            {/* Left Content */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 lg:space-y-8 text-center lg:text-left"
            >
                {/* Badge - Enhanced with Brown Text and Animation */}
                <motion.div 
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-earth-200/60 backdrop-blur-xl border-2 border-earth-400/50 text-earth-900 text-xs sm:text-sm font-black shadow-rustic mx-auto lg:mx-0"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        <Wifi size={14} className="text-earth-800" /> 
                    </motion.div>
                    <AnimatedText text="Live AIoT Connection" delay={0.3} />
                    <motion.div 
                        className="w-2 h-2 rounded-full bg-earth-700"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-black text-earth-900 leading-[1.1] tracking-tight"
                >
                    <AnimatedText text="Grow Smarter,      Harvest Better." delay={0.5} className="block" />
                    <br />
                    <motion.span 
                        className="text-transparent bg-clip-text bg-gradient-to-r from-earth-800 via-earth-700 to-earth-600 inline-block relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                        }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        {/* <AnimatedText text="Harvest Better." delay={0.8} continuous={true} /> */}
                        {/* Animated underline effect */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-earth-700 via-earth-600 to-earth-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
                        />
                        {/* Pulsing glow effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-earth-800/30 via-earth-700/40 to-earth-600/30 blur-2xl -z-10 rounded-lg"
                            animate={{ 
                                opacity: [0.2, 0.5, 0.2],
                                scale: [1, 1.1, 1],
                                x: [-10, 10, -10]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"
                            animate={{ 
                                x: ['-100%', '200%']
                            }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "linear"
                            }}
                        />
                    </motion.span>
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-lg sm:text-xl text-earth-800 leading-relaxed max-w-lg mx-auto lg:mx-0 font-bold"
                >
                    <AnimatedText 
                        text="Connect with nature through technology. Our AIoT system brings the farm to your fingertips, ensuring fresh harvests 365 days a year." 
                        delay={1.1}
                        className="inline"
                    />
                </motion.p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
                    <motion.button 
                         onClick={() => navigate('/register')}
                         className="px-8 py-4 bg-harvest-300 text-earth-900 font-black rounded-lg shadow-farm-lg hover:shadow-farm hover:scale-105 transition-all transform active:scale-95 flex items-center justify-center gap-2 border-2 border-harvest-400/40"
                         animate={{ 
                             opacity: [1, 0.5, 1],
                             boxShadow: [
                                 '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                 '0 10px 25px -5px rgba(234, 179, 8, 0.4), 0 10px 10px -5px rgba(234, 179, 8, 0.2)',
                                 '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                             ]
                         }}
                         transition={{ 
                             duration: 1.5,
                             repeat: Infinity,
                             ease: "easeInOut"
                         }}
                    >
                        Get Started <ArrowRight size={18} />
                    </motion.button>
                    <button 
                         onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                         className="px-8 py-4 bg-harvest-600/20 backdrop-blur-xl border-2 border-harvest-400/40 text-harvest-100 font-black rounded-lg hover:bg-harvest-600/30 transition-all flex items-center justify-center shadow-rustic"
                    >
                        Explore Features
                    </button>
                </div>

                {/* Mobile Tech Specs */}
                <div className="grid grid-cols-3 gap-2 pt-6 border-t border-earth-300/30 lg:hidden text-earth-800 text-xs">
                     <div className="flex flex-col items-center">
                         <span className="font-black text-lg text-earth-900">98%</span>
                         <span className="font-bold text-earth-700">Water Saved</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-earth-300/30">
                         <span className="font-black text-lg text-earth-900">A.I.</span>
                         <span className="font-bold text-earth-700">Optimization</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-earth-300/30">
                         <span className="font-black text-lg text-earth-900">24/7</span>
                         <span className="font-bold text-earth-700">Monitoring</span>
                     </div>
                </div>

            </motion.div>

            {/* Right Image - Enhanced Organic & Tech Blend */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mt-8 lg:mt-0"
            >
                 <div className="relative z-10 bg-gradient-to-br from-earth-100/40 to-earth-50/30 backdrop-blur-2xl rounded-[3rem] p-4 sm:p-8 border-2 border-earth-300/40 shadow-farm-lg">
                    <img 
                        src="/AiOt.jpeg" 
                        alt="AIoT Vertical Farm Diagram" 
                        className="w-full h-auto rounded-[2.5rem] shadow-2xl border-2 border-earth-200/50"
                    />
                    
                    {/* Floating Tech Cards - Enhanced with Brown */}
                    <div className="hidden sm:flex absolute -bottom-8 -left-8 bg-earth-50 p-5 rounded-3xl shadow-farm-lg items-center gap-4 animate-float border-2 border-earth-300/50">
                        <div className="p-3 bg-gradient-to-br from-earth-200 to-earth-300 rounded-2xl text-earth-800 shadow-inner">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-earth-700 font-bold uppercase tracking-wider">Growth Rate</p>
                            <p className="text-2xl font-black text-earth-900">+24%</p>
                        </div>
                    </div>

                    <div className="hidden sm:flex absolute -top-8 -right-8 bg-earth-50 p-5 rounded-3xl shadow-farm-lg items-center gap-4 animate-float border-2 border-earth-300/50" style={{ animationDelay: '0.5s' }}>
                        <div className="p-3 bg-gradient-to-br from-earth-200 to-earth-300 rounded-2xl text-earth-800 shadow-inner">
                            <Wifi size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-earth-700 font-bold uppercase tracking-wider">Connection</p>
                            <p className="text-2xl font-black text-earth-900">Strong</p>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -right-10 text-earth-400/20 w-64 h-64 -z-10 rotate-12">
                    <CircuitBoard size={256} />
                </div>
            </motion.div>
        </div>

        {/* SVG Wave Divider at Bottom */}
        <div className="absolute bottom-0 left-0 w-full leading-none overflow-hidden">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(113%+1.3px)] h-[40px] md:h-[60px] transform rotate-180">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F5E6D3"></path>
            </svg>
        </div>
      </section>

      {/* 
        HOW IT WORKS / PROCESS SECTION - Enhanced
      */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-b from-earth-50 via-farm-bg to-earth-50 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 lg:mb-20"
              >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-harvest-200 text-earth-800 font-black uppercase tracking-wider text-xs mb-4 border-2 border-harvest-300/50">
                      <Sprout size={14} /> Simple & Natural
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-black text-earth-900 mb-4">
                      From <span className="text-gradient-farm">Seed</span> to <span className="text-gradient-farm">Dashboard</span>
                  </h3>
                  <p className="text-earth-800 mt-4 max-w-2xl mx-auto text-base lg:text-lg font-bold">
                      We bridge the gap between biological growth and digital control. See how your farm comes to life.
                  </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
                  {/* Connector Line (Desktop) - Enhanced */}
                  <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-1.5 bg-gradient-to-r from-earth-200 via-earth-400 to-earth-200 -z-10 border-t-2 border-dashed border-earth-300/50 shadow-lg" />

                  <ProcessStep 
                      icon={Sun}
                      step="01"
                      title="Setup Environment"
                      desc="Install sensors and lights. Our layout adapts to your vertical space."
                      color="bg-orange-100 text-orange-600"
                      delay={0.2}
                  />
                  <ProcessStep 
                      icon={Cloud}
                      step="02"
                      title="Connect AIoT"
                      desc="Link your farm to the cloud. Our AI starts learning your crop patterns immediately."
                      color="bg-blue-100 text-blue-600"
                      delay={0.4}
                  />
                  <ProcessStep 
                      icon={Leaf}
                      step="03"
                      title="Monitor & Grow"
                      desc="Watch your crops thrive via the dashboard while we handle the irrigation."
                      color="bg-green-100 text-green-600"
                      delay={0.6}
                  />
              </div>
          </div>
      </section>

      {/* 
        FEATURES SECTION - Enhanced Card Grid 
      */}
      <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-earth-50 to-farm-bg relative">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                 {/* Mobile: Text First, then Cards. Desktop: Text Right, Cards Left. */}
                 <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                     <FeatureCard 
                        icon={Droplets}
                        title="Smart Irrigation"
                        desc="Precision watering saves 95% water."
                        color="bg-blue-50 text-blue-600"
                        delay={0.1}
                     />
                     <FeatureCard 
                        icon={Wind}
                        title="Climate Control"
                        desc="Maintain perfect temp & humidity."
                        color="bg-slate-50 text-slate-600"
                        delay={0.2}
                     />
                     <FeatureCard 
                        icon={Zap}
                        title="Energy Efficient"
                        desc="Optimized LED scheduling."
                        color="bg-yellow-50 text-yellow-600"
                        delay={0.3}
                     />
                     <FeatureCard 
                        icon={ShieldCheck}
                        title="Crop Health"
                        desc="AI disease detection & alerts."
                        color="bg-emerald-50 text-emerald-600"
                        delay={0.4}
                     />
                 </div>
                 
                 <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="order-1 lg:order-2 text-center lg:text-left"
                 >
                     <h3 className="text-4xl lg:text-5xl font-black text-earth-900 mb-6">
                         Technology that feels <br/><span className="text-gradient-farm">Natural.</span>
                     </h3>
                     <p className="text-lg text-earth-800 leading-relaxed mb-8 font-medium">
                         We don't just automate; we nurture. Our system mimics ideal natural conditions, giving your plants exactly what they need, when they need it. It's farming, evolved.
                     </p>
                     
                     <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                        <div className="flex items-center gap-4 text-earth-800 font-semibold bg-earth-50 p-4 rounded-2xl border-2 border-earth-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-earth-200 to-earth-300 flex items-center justify-center text-earth-800 shrink-0 shadow-inner"><BarChart3 size={20}/></div>
                             <span>Real-time growth analytics</span>
                        </div>
                        <div className="flex items-center gap-4 text-earth-800 font-semibold bg-earth-50 p-4 rounded-2xl border-2 border-earth-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-earth-200 to-earth-300 flex items-center justify-center text-earth-800 shrink-0 shadow-inner"><Smartphone size={20}/></div>
                             <span>Remote pump & light control</span>
                        </div>
                        <div className="flex items-center gap-4 text-earth-800 font-semibold bg-earth-50 p-4 rounded-2xl border-2 border-earth-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-earth-200 to-earth-300 flex items-center justify-center text-earth-800 shrink-0 shadow-inner"><Activity size={20}/></div>
                             <span>Historical harvest data</span>
                        </div>
                     </div>
                 </motion.div>
             </div>
         </div>
      </section>

      {/* 
        BOTTOM CTA & FOOTER - Enhanced
      */}
      <section className="relative bg-gradient-to-br from-earth-800 via-earth-700 to-earth-800 pt-32 pb-16 px-6 lg:px-12">
          {/* Top Wave Divider - Enhanced */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[1px]">
              <svg 
                  className="relative block w-full h-[60px] md:h-[120px]" 
                  data-name="Layer 1" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 1200 120" 
                  preserveAspectRatio="none"
              >
                  <path 
                    d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                    fill="#F5E6D3"
                  ></path>
              </svg>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 pattern-organic opacity-20" />

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative z-10 mb-20"
          >
              <div className="w-24 h-24 bg-harvest-300/30 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border-2 border-harvest-400/40 shadow-farm-lg animate-float">
                  <Leaf className="text-earth-900" size={48} />
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-harvest-100 mb-6">Ready for the <span className="text-gradient-harvest">Harvest?</span></h2>
              <p className="text-xl text-harvest-100 mb-10 font-medium">
                  Join hundreds of urban farmers transforming their yield with <span className="font-black text-harvest-200">AgriNex</span>.
              </p>
              
              <motion.button 
                  onClick={() => navigate('/register')}
                  className="bg-harvest-300 text-earth-900 font-black py-6 px-14 rounded-2xl shadow-farm-lg hover:shadow-farm hover:scale-105 transition-all text-lg flex items-center gap-3 mx-auto border-2 border-harvest-400/50"
                  animate={{ 
                      opacity: [1, 0.5, 1],
                      boxShadow: [
                          '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          '0 10px 25px -5px rgba(234, 179, 8, 0.4), 0 10px 10px -5px rgba(234, 179, 8, 0.2)',
                          '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      ]
                  }}
                  transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                  }}
              >
                  Get Started <ArrowRight size={20}/>
              </motion.button>
          </motion.div>

          {/* Footer Links */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-7xl mx-auto border-t border-harvest-400/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-harvest-200/80 text-sm relative z-10"
          >
              <p>© 2024 AIoT Smart Vertical Farming.</p>
              <div className="flex gap-8 flex-wrap justify-center">
                  <span className="hover:text-harvest-100 cursor-pointer transition-colors">Privacy Policy</span>
                  <span className="hover:text-harvest-100 cursor-pointer transition-colors">Terms of Service</span>
                  <span className="hover:text-harvest-100 cursor-pointer transition-colors" onClick={() => navigate('/contact')}>Contact Support</span>
              </div>
          </motion.div>
      </section>
    </div>
  );
};

/* Helper Components */
const FeatureCard = ({ icon: Icon, title, desc, color, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay }}
        className={`p-6 lg:p-8 rounded-3xl border-2 border-earth-200/50 shadow-farm hover:shadow-farm-lg transition-all hover:-translate-y-2 bg-earth-50 group ${color} bg-opacity-10`}
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-earth-100 to-earth-200 shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon size={28} className={color.replace('bg-', 'text-').replace('/10', '')} />
        </div>
        <h3 className="font-black text-earth-900 text-xl mb-3">{title}</h3>
        <p className="text-earth-800 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

const ProcessStep = ({ icon: Icon, step, title, desc, color, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay }}
        className="relative flex flex-col items-center text-center p-8 bg-earth-50 rounded-3xl shadow-farm border-2 border-earth-200/50 z-10 hover:shadow-farm-lg hover:-translate-y-2 transition-all duration-300 card-farm-elevated group"
    >
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform ${color.replace('text', 'bg').split(' ')[0]}`}>
           <Icon size={36} color="white" />
        </div>
        <div className="absolute top-8 right-8 text-5xl font-black text-earth-200 z-0 select-none opacity-60 group-hover:opacity-80 transition-opacity">{step}</div>
        <h3 className="text-2xl font-black text-earth-900 mb-4">{title}</h3>
        <p className="text-earth-800 leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

export default Home;
