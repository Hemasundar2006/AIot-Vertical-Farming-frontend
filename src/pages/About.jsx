import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Target, Shield, Sprout, TrendingUp, Users, CheckCircle, Globe, Zap, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Animation Variants ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
};

const staggerFast = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

/* ── Sub-components ── */
const ValueCard = ({ icon: Icon, title, desc }) => (
  <motion.div
    variants={scaleIn}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group relative overflow-hidden"
  >
    {/* Subtle background blob on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#213E20]/0 to-[#C49E40]/0 group-hover:from-[#213E20]/3 group-hover:to-[#C49E40]/3 transition-all duration-500 rounded-3xl" />
    <motion.div
      className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#1F3B21] group-hover:bg-[#1F3B21] group-hover:text-[#C49E40] transition-all duration-300 mb-5 shadow-sm relative z-10"
      whileHover={{ rotate: 8, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Icon size={22} />
    </motion.div>
    <h4 className="text-lg font-bold text-gray-900 mb-2 relative z-10">{title}</h4>
    <p className="text-sm text-gray-500 font-medium leading-relaxed relative z-10">{desc}</p>
  </motion.div>
);

const StatBadge = ({ value, label }) => (
  <motion.div
    variants={fadeInUp}
    className="flex flex-col items-center px-6 py-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm"
  >
    <span className="text-3xl font-black text-[#1F3B21]">{value}</span>
    <span className="text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{label}</span>
  </motion.div>
);

/* ── Main Component ── */
const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-agri-light pt-28 pb-24 px-6 lg:px-12 relative overflow-x-hidden">
      {/* Floating background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-[#C49E40]/6 blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-40 -right-32 w-[480px] h-[480px] rounded-full bg-[#213E20]/5 blur-3xl"
          animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#84cc16]/4 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213E20]/6 text-[#213E20] rounded-full text-sm md:text-[11px] font-black uppercase tracking-widest mb-5 border border-[#213E20]/10"
          >
            <Leaf size={13} className="text-[#C49E40]" /> Our Story
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6"
          >
            Pioneering the Future of{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient-animated">Sustainable Agriculture</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg text-gray-600 font-medium leading-relaxed">
            At Agrinex, we merge cutting-edge AI, IoT telemetry, and proven vertical farming techniques
            to revolutionize how the world grows food — using <strong>90% less water</strong> and zero pesticides.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            <StatBadge value="90%" label="Water Saved" />
            <StatBadge value="3×" label="Yield Increase" />
            <StatBadge value="0" label="Pesticides" />
            <StatBadge value="24/7" label="AI Monitoring" />
          </motion.div>
        </motion.div>

        {/* ── Mission & Vision Cards ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          {/* Mission */}
          <motion.div
            variants={fadeInLeft}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[2rem] p-10 shadow-md relative overflow-hidden border border-gray-100"
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-[2rem] animate-glow-border pointer-events-none" />
            <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
              <Target size={130} />
            </div>
            <motion.div
              className="w-14 h-14 bg-[#213E20] rounded-2xl flex items-center justify-center text-[#C49E40] shadow-lg mb-6 relative z-10"
              whileHover={{ rotate: -8 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              <Target size={28} />
            </motion.div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-4 relative z-10">Our Mission</h3>
            <p className="text-gray-600 font-medium leading-relaxed relative z-10">
              To empower modern farmers with intelligent, data-driven systems that maximize crop yields
              while drastically reducing environmental impact. We believe in providing accessible,
              scalable technology for farms of any size.
            </p>
            <ul className="mt-6 space-y-2 relative z-10">
              {['Precision water management', 'AI-driven crop analytics', 'Real-time IoT telemetry'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <CheckCircle size={15} className="text-[#213E20] shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Vision */}
          <motion.div
            variants={fadeInRight}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="bg-[#213E20] rounded-[2rem] p-10 shadow-lg relative overflow-hidden text-white border-2 border-transparent"
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-[2rem] animate-glow-border-dark pointer-events-none" />
            <div className="absolute top-0 right-0 p-8 opacity-[0.06] pointer-events-none">
              <Shield size={130} />
            </div>
            {/* Subtle shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2rem] pointer-events-none" />
            <motion.div
              className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-[#C49E40] shadow-md mb-6 relative z-10"
              whileHover={{ rotate: 8 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              <Shield size={28} />
            </motion.div>
            <h3 className="text-2xl font-extrabold text-white mb-4 relative z-10">Our Vision</h3>
            <p className="text-gray-300 font-medium leading-relaxed relative z-10">
              A world where fresh, hyper-local produce is available year-round in every community,
              completely independent of climate instability or geographic limitations.
              We envision a globally resilient food network powered by AI.
            </p>
            <ul className="mt-6 space-y-2 relative z-10">
              {['Zero food-miles supply chain', 'Climate-proof agriculture', 'Global food security'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                  <CheckCircle size={15} className="text-[#C49E40] shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Core Values ── */}
        <motion.div
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#213E20]/6 text-[#213E20] rounded-full text-sm md:text-[11px] font-black uppercase tracking-widest border border-[#213E20]/10 mb-4">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Built on Core Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              icon={Sprout}
              title="Sustainability First"
              desc="Every algorithm we write and every sensor we deploy is designed to conserve resources and protect the earth for future generations."
            />
            <ValueCard
              icon={TrendingUp}
              title="Data-Driven Yields"
              desc="We replace guesswork with precision analytics, ensuring farmers achieve maximum profitability every harvest with actionable insights."
            />
            <ValueCard
              icon={Users}
              title="Community Growth"
              desc="We are committed to educating and supporting the next generation of agri-tech entrepreneurs and local growers worldwide."
            />
          </div>
        </motion.div>

        {/* ── Why Agrinex ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          {[
            { icon: Globe, title: 'Global Reach', desc: 'Deployed across 12+ states in India with partnerships spanning 3 continents.' },
            { icon: Zap, title: 'Rapid Setup', desc: 'Our modular IoT kits are farm-ready in under 48 hours with zero downtime.' },
            { icon: Brain, title: 'Adaptive AI', desc: 'Our models retrain continuously on your farm data to improve accuracy over time.' },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={scaleIn}
              whileHover={{ y: -5 }}
              className="flex flex-col items-start gap-4 bg-white rounded-2xl p-7 border border-gray-100 shadow-sm group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#213E20]/8 flex items-center justify-center text-[#213E20] group-hover:bg-[#213E20] group-hover:text-[#C49E40] transition-all duration-300">
                <Icon size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 mb-1">{title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          className="relative bg-white rounded-[2rem] p-12 text-center shadow-md overflow-hidden border border-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {/* Animated border */}
          <div className="absolute inset-0 rounded-[2rem] animate-glow-border pointer-events-none" />
          {/* Background gradient blob */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#213E20]/3 via-transparent to-[#C49E40]/3 rounded-[2rem] pointer-events-none" />

          <div className="relative z-10">
            <motion.div variants={scaleIn} className="w-16 h-16 bg-[#213E20] rounded-2xl flex items-center justify-center text-[#C49E40] mx-auto mb-6 shadow-lg">
              <Leaf size={30} />
            </motion.div>
            <motion.h3 variants={fadeInUp} className="text-3xl font-extrabold text-gray-900 mb-4">
              Join the Agricultural Revolution
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-gray-600 mb-8 max-w-2xl mx-auto font-medium text-lg">
              Whether you're starting a small indoor farm or scaling a massive commercial operation,
              Agrinex has the technology you need to thrive.
            </motion.p>
            <motion.button
              variants={fadeInUp}
              onClick={() => navigate('/contact')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#C49E40] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(196,158,64,0.35)] hover:bg-[#b38f3a] transition-colors"
            >
              Contact Our Team
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default About;
