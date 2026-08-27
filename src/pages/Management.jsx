import React from 'react';
import { motion } from 'framer-motion';
import { Users, Linkedin, Twitter, Mail, Award, Brain, Sprout, ArrowRight } from 'lucide-react';
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

const staggerFast = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};

/* ── Team Member Card ── */
const TeamCard = ({ member, index }) => (
  <motion.div
    variants={scaleIn}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group relative"
  >
    {/* Image */}
    <div className="relative w-full aspect-[4/3] overflow-hidden">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#213E20]/85 via-[#213E20]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      {/* Social icons - appear on hover */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-75">
        <button className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#C49E40] transition-colors border border-white/30">
          <Linkedin size={15} />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#C49E40] transition-colors border border-white/30">
          <Twitter size={15} />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#C49E40] transition-colors border border-white/30">
          <Mail size={15} />
        </button>
      </div>

      {/* Role badge */}
      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
        <span className="text-[10px] font-black uppercase tracking-widest text-white">{member.role.split(' ')[0]}</span>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#213E20]/8 flex items-center justify-center text-[#C49E40] group-hover:bg-[#213E20] transition-colors duration-300">
          <member.icon size={17} />
        </div>
        <div>
          <h3 className="font-extrabold text-gray-900 text-base leading-tight group-hover:text-[#1F3B21] transition-colors">
            {member.name}
          </h3>
          <p className="text-[11px] text-[#C49E40] font-bold uppercase tracking-wider">{member.role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">{member.bio}</p>
    </div>
  </motion.div>
);

/* ── Main Component ── */
const Management = () => {
  const navigate = useNavigate();

  const TEAM_MEMBERS = [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      bio: 'Former VP of AgriTech at GlobalFarms. Sarah leads Agrinex with a vision to make precision farming universally accessible.',
      icon: Award,
    },
    {
      name: 'Marcus Chen',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
      bio: 'AI researcher and architect. Marcus designed the core neural networks powering our crop and water prediction models.',
      icon: Brain,
    },
    {
      name: 'Elena Rodriguez',
      role: 'Lead Agronomist',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80',
      bio: 'With 15+ years in vertical farming, Elena ensures our tech translates perfectly to real-world biological needs.',
      icon: Sprout,
    },
    {
      name: 'David Okafor',
      role: 'Head of IoT Operations',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
      bio: 'Hardware engineering expert. David manages our global network of telemetry sensors and automated climate controls.',
      icon: Users,
    },
  ];

  const STATS = [
    { value: '40+', label: 'Team Members' },
    { value: '12+', label: 'States Covered' },
    { value: '8 yrs', label: 'Combined Expertise' },
    { value: '99%', label: 'Client Satisfaction' },
  ];

  return (
    <div className="min-h-screen bg-agri-light pt-28 pb-24 px-6 lg:px-12 relative overflow-x-hidden">
      {/* Floating background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#C49E40]/5 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#213E20]/5 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213E20]/6 text-[#213E20] rounded-full text-[11px] font-black uppercase tracking-widest mb-5 border border-[#213E20]/10"
          >
            <Users size={13} className="text-[#C49E40]" /> Leadership
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6"
          >
            Meet the Minds{' '}
            <br className="hidden sm:block" />
            Behind <span className="text-gradient-animated">Agrinex</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg text-gray-600 font-medium leading-relaxed">
            A diverse team of agronomists, AI engineers, and hardware specialists dedicated to
            transforming the global agricultural landscape.
          </motion.p>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
          initial="hidden"
          animate="visible"
          variants={staggerFast}
        >
          {STATS.map(({ value, label }) => (
            <motion.div
              key={label}
              variants={scaleIn}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center py-6 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <span className="text-3xl font-black text-[#1F3B21]">{value}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1 text-center">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Team Grid — 2 cols on md, 4 on xl ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
        >
          {TEAM_MEMBERS.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </motion.div>

        {/* ── Values Strip ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          {[
            { emoji: '🌱', title: 'Rooted in Science', desc: 'Every decision we make is backed by data, research, and decades of agronomic expertise.' },
            { emoji: '🤝', title: 'Farmer-First Culture', desc: 'We listen to growers. Our roadmap is built on real-world feedback from the farms we serve.' },
            { emoji: '🚀', title: 'Move Fast, Grow Slow', desc: 'We iterate rapidly on software while championing the patient, cyclical rhythm of nature.' },
          ].map(({ emoji, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col gap-3"
            >
              <span className="text-3xl">{emoji}</span>
              <h4 className="font-extrabold text-gray-900">{title}</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Join the team CTA ── */}
        <motion.div
          className="relative bg-[#213E20] rounded-[2rem] p-10 sm:p-14 text-center shadow-xl overflow-hidden text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {/* Background texture image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 rounded-[2rem]"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530836369250-ef71a4eb5cce?w=1200&q=80')" }}
          />
          {/* Animated border */}
          <div className="absolute inset-0 rounded-[2rem] animate-glow-border-dark pointer-events-none" />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-[2rem] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              variants={scaleIn}
              className="w-16 h-16 bg-[#C49E40] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Users size={30} />
            </motion.div>
            <motion.h3 variants={fadeInUp} className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Want to help feed the future?
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-gray-300 mb-8 font-medium text-lg leading-relaxed">
              We are always looking for passionate engineers, botanists, and visionaries to join our growing team.
            </motion.p>
            <motion.button
              variants={fadeInUp}
              onClick={() => navigate('/contact')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-[#C49E40] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(196,158,64,0.4)] hover:bg-[#b38f3a] transition-colors"
            >
              View Open Roles <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Management;
