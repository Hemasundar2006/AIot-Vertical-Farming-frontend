import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Droplets, TrendingUp, Cpu, Leaf, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Animation Variants ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const staggerFast = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

/* ── Metric Pill ── */
const MetricPill = ({ icon: Icon, value, label }) => (
  <motion.div
    variants={scaleIn}
    className="flex flex-col items-center gap-1 bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 border border-gray-100 shadow-sm"
  >
    <div className="w-10 h-10 bg-[#213E20] text-[#C49E40] rounded-xl flex items-center justify-center shadow-md mb-1">
      <Icon size={18} />
    </div>
    <span className="text-xl font-black text-gray-900">{value}</span>
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">{label}</span>
  </motion.div>
);

/* ── Project Card — alternating layout ── */
const ProjectCard = ({ project, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={stagger}
      className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
      style={{ boxShadow: '0 4px 40px -8px rgba(31,59,33,0.08), 0 2px 8px rgba(0,0,0,0.03)' }}
    >
      {/* Image half */}
      <motion.div
        variants={isEven ? fadeInLeft : fadeInRight}
        className={`relative ${isEven ? '' : 'lg:order-last'} min-h-[300px] lg:min-h-[420px]`}
      >
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Location badge */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold tracking-wider uppercase border border-white/30 shadow-sm">
          <MapPin size={13} />
          {project.location}
        </div>

        {/* Status badge */}
        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#213E20]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <div className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Active</span>
        </div>
      </motion.div>

      {/* Content half */}
      <motion.div
        variants={isEven ? fadeInRight : fadeInLeft}
        className={`${isEven ? '' : 'lg:order-first'} flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-12`}
      >
        {/* Project number */}
        <div className="text-[11px] font-black text-[#C49E40] uppercase tracking-widest mb-3">
          Project 0{project.id}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
          {project.title}
        </h2>
        <p className="text-gray-500 font-medium leading-relaxed mb-8">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-[#213E20]/6 text-[#213E20] text-[11px] font-bold uppercase tracking-wider border border-[#213E20]/10"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Metrics */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-8"
          variants={staggerFast}
        >
          {project.metrics.map((metric) => (
            <MetricPill key={metric.label} icon={metric.icon} value={metric.value} label={metric.label} />
          ))}
        </motion.div>

        <motion.button
          onClick={() => {}}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 text-[#C49E40] font-bold uppercase tracking-wider text-sm group w-fit"
        >
          Start a Similar Project
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Component ── */
const Projects = () => {
  const navigate = useNavigate();

  const PROJECTS = [
    {
      id: 1,
      title: 'Project Genesis: Vertical Tower Array',
      location: 'Hyderabad, Telangana',
      image: 'https://images.unsplash.com/photo-1558434608-54b03f0b2f5b?w=800&q=80',
      description: 'A fully automated 10-level vertical hydroponic facility that produces 12 tons of leafy greens annually in an urban setting, powered by real-time Agrinex AI.',
      tags: ['Hydroponics', 'AI Control', 'Urban Farm'],
      metrics: [
        { label: 'Water Saved', value: '94%', icon: Droplets },
        { label: 'Yield Increase', value: '3×', icon: TrendingUp },
        { label: 'Automation', value: 'L4', icon: Cpu },
      ],
    },
    {
      id: 2,
      title: 'Eco-Smart Greenhouse Integration',
      location: 'Pune, Maharashtra',
      image: 'https://images.unsplash.com/photo-1627409249747-8a6e87fbc4ab?w=800&q=80',
      description: 'Retrofitting a traditional 2-acre greenhouse with IoT sensors, predictive climate control, and automated irrigation valves — zero construction required.',
      tags: ['IoT Retrofit', 'Climate AI', 'Irrigation'],
      metrics: [
        { label: 'Energy Cut', value: '42%', icon: Cpu },
        { label: 'Yield Increase', value: '1.8×', icon: TrendingUp },
        { label: 'Water Saved', value: '65%', icon: Droplets },
      ],
    },
    {
      id: 3,
      title: 'Solar-Powered Aeroponics Pod',
      location: 'Bangalore, Karnataka',
      image: 'https://images.unsplash.com/photo-1592424040406-8d63339edec5?w=800&q=80',
      description: 'An off-grid container farm using advanced aeroponics and solar energy, serving hyper-local organic produce to nearby restaurants with zero carbon footprint.',
      tags: ['Aeroponics', 'Solar', 'Off-Grid'],
      metrics: [
        { label: 'Carbon', value: 'Zero', icon: Leaf },
        { label: 'Water Saved', value: '98%', icon: Droplets },
        { label: 'Grow Cycles', value: '18/yr', icon: TrendingUp },
      ],
    },
  ];

  const BENEFITS = [
    'Reduced setup time with pre-configured sensor kits',
    'Continuous AI model retraining on your specific crops',
    'Real-time alerts and automated interventions',
    'White-glove onboarding and 24/7 technical support',
  ];

  return (
    <div className="min-h-screen bg-agri-light pt-28 pb-24 px-6 lg:px-12 relative overflow-x-hidden">
      {/* Floating background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 -left-40 w-[480px] h-[480px] rounded-full bg-[#C49E40]/5 blur-3xl"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 -right-40 w-[500px] h-[500px] rounded-full bg-[#213E20]/4 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
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
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213E20]/6 text-[#213E20] rounded-full text-[11px] font-black uppercase tracking-widest mb-5 border border-[#213E20]/10"
          >
            <Leaf size={13} className="text-[#C49E40]" /> Case Studies
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6"
          >
            Featured{' '}
            <span className="text-gradient-animated">Projects</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg text-gray-600 font-medium leading-relaxed">
            Discover how Agrinex technology is being deployed across the country to build sustainable,
            high-yield smart farms at every scale.
          </motion.p>
        </motion.div>

        {/* ── Projects List ── */}
        <div className="space-y-10 mb-24">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* ── Why Start a Project ── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.div variants={fadeInLeft}>
            <span className="inline-block px-4 py-1.5 bg-[#213E20]/6 text-[#213E20] rounded-full text-[11px] font-black uppercase tracking-widest border border-[#213E20]/10 mb-5">
              Why Agrinex
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Built for real farms,{' '}
              <span className="text-gradient-animated">not just demos</span>
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              Our projects aren't proof-of-concepts — they are production farms generating real yields
              for real communities. Every deployment is engineered to last.
            </p>
            <ul className="space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                  <CheckCircle size={17} className="text-[#213E20] shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"
              alt="Agrinex farm technology"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#213E20]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
              <p className="text-white font-bold text-sm">
                "Agrinex cut our water bill by 70% in the first season."
              </p>
              <p className="text-white/70 text-xs font-medium mt-1">— Rajesh K., Farmer, Telangana</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div
            variants={scaleIn}
            className="inline-block bg-white rounded-[2rem] px-10 py-12 shadow-md border border-gray-100 relative overflow-hidden max-w-2xl w-full"
          >
            {/* Animated border */}
            <div className="absolute inset-0 rounded-[2rem] animate-glow-border pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#213E20] rounded-2xl flex items-center justify-center text-[#C49E40] mx-auto mb-6 shadow-xl">
                <Leaf size={30} />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Ready to upgrade your farm?</h3>
              <p className="text-gray-500 font-medium mb-8">
                Join 200+ farms already running Agrinex smart systems and see measurable results in your first harvest.
              </p>
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-[#213E20] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-xl hover:bg-[#152a16] transition-colors"
              >
                Create Your Account <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default Projects;
