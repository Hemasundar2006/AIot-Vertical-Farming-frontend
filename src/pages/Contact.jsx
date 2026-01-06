import React, { useState } from 'react';
import { Mail, Phone, Send, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://aiot-vertical-farming-backend.onrender.com';

const Contact = () => {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDescription, setLiveDescription] = useState('');
  const [savingLink, setSavingLink] = useState(false);

  const handleSaveLiveLink = async (e) => {
    e.preventDefault();
    if (!youtubeLink.trim()) {
      toast.error('Please enter a YouTube live link');
      return;
    }
    setSavingLink(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/live/set-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamUrl: youtubeLink.trim(),
          title: liveTitle.trim() || undefined,
          description: liveDescription.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Failed to save live link');
      }
      toast.success(data.message || 'Live link saved');
      setYoutubeLink('');
      setLiveTitle('');
      setLiveDescription('');
    } catch (err) {
      toast.error(err.message || 'Failed to save live link');
    } finally {
      setSavingLink(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20 pb-12 px-6 lg:px-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Visual & Info */}
        <div className="space-y-8 lg:pr-8">
            <div>
                <h2 className="text-emerald-700 font-bold text-lg mb-2 flex items-center gap-2">
                    <MessageSquare size={20}/> Get in Touch
                </h2>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                    Contact Our <br/> <span className="text-emerald-800">Expert Team</span>
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed">
                    We'd love to hear from you. Whether you have a question about features, trials, or just want to say hi, our team is ready to answer all your questions.
                </p>
            </div>

            {/* Visual Image (Reusing the generated hero image for consistency with the design language) */}
            <div className="relative">
                 <img 
                    src="/vertical-farm-hero.png" 
                    alt="Contact Support" 
                    className="w-full h-auto drop-shadow-xl"
                />
            </div>

            {/* Quick Contact Info */}
             <div className="flex flex-wrap gap-8 pt-4">
                <div className="flex items-center gap-3 text-slate-700 group cursor-pointer">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg group-hover:bg-emerald-200 transition-colors">
                        <Mail size={20} />
                    </div>
                    <span className="font-medium group-hover:text-emerald-800 transition-colors">support@verticalgrow.ai</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 group cursor-pointer">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-200 transition-colors">
                         <Phone size={20} />
                    </div>
                    <span className="font-medium group-hover:text-blue-800 transition-colors">+1 (555) 123-4567</span>
                </div>
            </div>
        </div>

        {/* Right Side: Contact Form Card */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl border border-slate-100 relative space-y-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Send Message</h2>
            <p className="text-slate-500 mb-8">Fill out the form below and we'll get back to you shortly.</p>
            
            <form className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400" 
                        placeholder="John Doe" 
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email ID</label>
                    <input 
                        type="email" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400" 
                        placeholder="john@example.com" 
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
                        <input 
                            type="tel" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400" 
                            placeholder="+1 (555) 000-0000" 
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all">
                            <option>General Inquiry</option>
                            <option>Technical Support</option>
                            <option>Sales</option>
                            <option>Partnership</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea 
                        rows="4" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 resize-none" 
                        placeholder="How can we help you?"
                    ></textarea>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 mt-2"
                >
                    <Send size={20} /> Send Message
                </motion.button>
            </form>

            {/* Live Stream Link Setter */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <LinkIcon size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Set Live Stream Link</h3>
                  <p className="text-sm text-slate-500">Save the active YouTube live link for the Image Detection page.</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSaveLiveLink}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">YouTube Live Link</label>
                  <input
                    type="url"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Title (optional)</label>
                    <input
                      type="text"
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                      placeholder="Live Workshop"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description (optional)</label>
                    <input
                      type="text"
                      value={liveDescription}
                      onChange={(e) => setLiveDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                      placeholder="Brief description"
                    />
                  </div>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: savingLink ? 1 : 1.01 }}
                  whileTap={{ scale: savingLink ? 1 : 0.99 }}
                  disabled={savingLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {savingLink ? (
                    <>
                      <Send size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Save Live Link
                    </>
                  )}
                </motion.button>
              </form>
            </div>
            
            <div className="mt-6 text-center pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                    By contacting us, you agree to our <span className="text-emerald-700 font-medium cursor-pointer">Terms of Service</span> and <span className="text-emerald-700 font-medium cursor-pointer">Privacy Policy</span>.
                </p>
            </div>
        </div>

      </div>
      
      {/* Simple Footer Links */}
      <div className="fixed bottom-4 left-0 w-full text-center pointer-events-none">
          <div className="inline-flex gap-4 text-xs text-slate-400 pointer-events-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
             <span>Privacy Policy</span>
             <span>|</span>
             <span>Terms of Service</span>
             <span>|</span>
             <span>Contact Us</span>
          </div>
      </div>
    </div>
  );
};

export default Contact;
