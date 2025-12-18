import React from 'react';
import { ArrowRight, Sprout, ShieldCheck, Zap, Cloud, Smartphone, BarChart3, Droplets, Leaf, Activity, Sun, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-slate-50 relative overflow-x-hidden">
      
      {/* 
        HERO SECTION 
        Uses the Farm Green theme with organic wave divider and subtle leaf pattern overlay
      */}
      <section className="relative bg-[#688557] pt-32 pb-32 px-6 lg:px-12 overflow-hidden">
        
        {/* Abstract Background Pattern (Subtle Leaves/Growth) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0 C 40 10 60 50 100 0 L 100 100 L 0 100 Z" fill="white" fillOpacity="0.1"/>
                <circle cx="10" cy="20" r="5" fill="white" />
                <circle cx="90" cy="80" r="15" fill="white" />
                <path d="M50 50 Q 70 20 90 50 T 130 50" stroke="white" strokeWidth="0.5" fill="none"/>
            </svg>
        </div>
        
        {/* Floating Ambient Light */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Content */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-400/30 text-emerald-50 text-sm font-semibold backdrop-blur-md">
                    <Sprout size={16} className="text-emerald-300" /> 
                    <span>Smart Vertical Farming</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                    Grow Smarter, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-lime-200">
                        Live Better.
                    </span>
                </h1>
                
                <p className="text-xl text-emerald-100/90 leading-relaxed max-w-lg">
                    Connect with nature through technology. Our AIoT system brings the farm to your fingertips, ensuring fresh harvests 365 days a year.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                         onClick={() => navigate('/register')}
                         className="px-8 py-4 bg-white text-[#688557] font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-emerald-50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        Get Started <ArrowRight size={18} />
                    </button>
                    <button 
                         onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                         className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center"
                    >
                        Explore Features
                    </button>
                </div>
            </motion.div>

            {/* Right Image - Organic & Tech Blend */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mt-12 lg:mt-0"
            >
                 <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[2.5rem] p-4 lg:p-6 border border-white/20 shadow-2xl">
                    <img 
                        src="/AiOt.jpeg" 
                        alt="AIoT Vertical Farm Diagram" 
                        className="w-full h-auto rounded-[2rem] shadow-lg"
                    />
                    
                    {/* Floating Cards - Reposition for Mobile */}
                    <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl items-center gap-3 animate-bounce-slow">
                        <div className="p-3 bg-red-100 rounded-full text-red-500">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Growth Rate</p>
                            <p className="text-lg font-extrabold text-slate-900">+24%</p>
                        </div>
                    </div>

                    <div className="hidden sm:flex absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl items-center gap-3 animate-bounce-slow delay-700">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-500">
                            <Droplets size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Water Saved</p>
                            <p className="text-lg font-extrabold text-slate-900">450L</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* SVG Wave Divider at Bottom */}
        <div className="absolute bottom-0 left-0 w-full leading-none overflow-hidden">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(113%+1.3px)] h-[60px] transform rotate-180">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F8FAFC"></path>
            </svg>
        </div>
      </section>

      {/* 
        HOW IT WORKS / PROCESS SECTION 
        Connects the user to the "Farming" aspect via a timeline/process flow
      */}
      <section id="how-it-works" className="py-24 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                  <h2 className="text-emerald-700 font-bold uppercase tracking-wider text-sm mb-3">Simple & Natural</h2>
                  <h3 className="text-4xl font-extrabold text-slate-900">From Seed to Dashboard</h3>
                  <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                      We bridge the gap between biological growth and digital control. See how your farm comes to life.
                  </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {/* Connector Line (Desktop) */}
                  <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100 -z-10 border-t-2 border-dashed border-emerald-300/50" />

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
        FEATURES SECTION - Card Grid 
        Clean white design for readability
      */}
      <section className="py-24 bg-white relative">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="order-1 lg:order-2"
                 >
                     <h3 className="text-4xl font-extrabold text-slate-900 mb-6">
                         Technology that feels <br/><span className="text-[#688557]">Natural.</span>
                     </h3>
                     <p className="text-lg text-slate-600 leading-relaxed mb-8">
                         We don't just automate; we nurture. Our system mimics ideal natural conditions, giving your plants exactly what they need, when they need it. It's farming, evolved.
                     </p>
                     <ul className="space-y-4">
                         <li className="flex items-center gap-3 text-slate-700 font-medium">
                             <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><ArrowRight size={14}/></div>
                             Real-time growth analytics
                         </li>
                         <li className="flex items-center gap-3 text-slate-700 font-medium">
                             <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><ArrowRight size={14}/></div>
                             Remote pump & light control
                         </li>
                         <li className="flex items-center gap-3 text-slate-700 font-medium">
                             <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><ArrowRight size={14}/></div>
                             Historical harvest data
                         </li>
                     </ul>
                 </motion.div>
             </div>
         </div>
      </section>

      {/* 
        BOTTOM CTA & FOOTER
        Combined for seamless look
      */}
      <section className="relative bg-[#688557] pt-24 pb-12 px-6 lg:px-12">
          {/* Top Wave Divider - Clean & Seamless */}
          <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[1px]">
              <svg 
                  className="relative block w-full h-[80px] md:h-[120px]" 
                  data-name="Layer 1" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 1200 120" 
                  preserveAspectRatio="none"
              >
                  <path 
                    d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                    fill="#FFFFFF"
                  ></path>
              </svg>
          </div>

          {/* CTA Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center relative z-10 mb-20"
          >
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                  <Leaf className="text-white" size={40} />
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Ready for the Harvest?</h2>
              <p className="text-xl text-emerald-100 mb-10">
                  Join hundreds of urban farmers transforming their yield with VerticalGrow.
              </p>
              
              <button 
                  onClick={() => navigate('/register')}
                  className="bg-white text-[#688557] font-bold py-5 px-12 rounded-full shadow-2xl hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 transition-all text-lg flex items-center gap-3 mx-auto"
              >
                  Get Started <ArrowRight size={20}/>
              </button>
          </motion.div>

          {/* Integrated Footer Links */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-emerald-100/60 text-sm relative z-10"
          >
              <p>© 2024 AIoT Smart Vertical Farming.</p>
              <div className="flex gap-8">
                  <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                  <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                  <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/contact')}>Contact Support</span>
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
        className={`p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 ${color} bg-opacity-30`}
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white shadow-sm`}>
            <Icon size={24} />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

const ProcessStep = ({ icon: Icon, step, title, desc, color, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay }}
        className="relative flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-lg border border-slate-100 z-10 hover:shadow-xl transition-shadow"
    >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white text-xl font-bold ${color.replace('text', 'bg').split(' ')[0]}`}>
           <Icon size={32} color="white" />
        </div>
        <div className="absolute top-6 right-6 text-4xl font-black text-slate-100 z-0 select-none opacity-50">{step}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
);

export default Home;
