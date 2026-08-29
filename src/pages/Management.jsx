import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Linkedin, Twitter, Mail, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/* -- Animation Variants -- */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

/* -- Team Member Card -- */
const TeamCard = ({ member }) => (
  <motion.div
    variants={scaleIn}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group relative flex flex-col h-full"
  >
    {/* Image */}
    <div className="relative w-full aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
      {member.photoUrl || member.image || member.imageUrl ? (
        <img
          src={member.photoUrl || member.image || member.imageUrl}
          alt={member.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
           <span className="text-6xl font-bold text-gray-400">{member.name.charAt(0)}</span>
        </div>
      )}
      
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
        <span className="text-sm md:text-[10px] font-black uppercase tracking-widest text-white">{((member.role || member.designation) || 'Member').split(' ')[0]}</span>
      </div>
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex flex-col gap-1 mb-3">
        <h3 className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-[#1F3B21] transition-colors text-center">
          {member.name}
        </h3>
        <p className="text-sm md:text-[11px] text-[#C49E40] font-bold uppercase tracking-wider text-center">{member.role || member.designation}</p>
      </div>
      
      {member.collegeName && (
        <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-full mb-4 w-full">
          <GraduationCap size={14} className="text-[#C49E40]" />
          <span className="truncate">{member.collegeName}</span>
        </div>
      )}
      
      <p className="text-sm text-gray-500 font-medium leading-relaxed flex-grow text-center">{member.bio || member.description}</p>
    </div>
  </motion.div>
);

/* -- Main Component -- */
const Management = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagement = async () => {
      try {
        const token = localStorage.getItem('farm_token');
        const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';
        
        const response = await axios.get(${API_URL}/admin/management);
        
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          setTeamMembers(data);
        }
      } catch (error) {
        console.error('Failed to fetch management team:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagement();
  }, []);

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

        {/* -- Header -- */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213E20]/6 text-[#213E20] rounded-full text-sm md:text-[11px] font-black uppercase tracking-widest mb-5 border border-[#213E20]/10"
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

        {/* -- Team Grid — 2 cols on md, 4 on xl -- */}
        {loading ? (
           <div className="text-center py-20 text-gray-500 font-medium">Loading Team...</div>
        ) : teamMembers.length === 0 ? (
           <div className="text-center py-20 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm mb-24">No team members currently active.</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {teamMembers.map((member, index) => (
              <TeamCard key={member._id || member.name} member={member} />
            ))}
          </motion.div>
        )}

        {/* -- Values Strip -- */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          {[
            { emoji: '??', title: 'Rooted in Science', desc: 'Every decision we make is backed by data, research, and decades of agronomic expertise.' },
            { emoji: '??', title: 'Farmer-First Culture', desc: 'We listen to growers. Our roadmap is built on real-world feedback from the farms we serve.' },
            { emoji: '??', title: 'Move Fast, Grow Slow', desc: 'We iterate rapidly on software while championing the patient, cyclical rhythm of nature.' },
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

        {/* -- Join the team CTA -- */}
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
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80')" }}
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
