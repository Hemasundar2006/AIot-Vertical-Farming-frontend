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
    <div className="min-h-screen bg-white flex items-center justify-center pt-20 pb-12 px-6 lg:px-12 font-sans text-earth-900">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        
        {/* Left Side: Visual & Info */}
        <div className="space-y-8 lg:pr-8 flex flex-col h-full">
            <div>
                <h2 className="text-earth-700 font-bold text-lg mb-2 flex items-center gap-2">
                    <MessageSquare size={20}/> Get in Touch
                </h2>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-earth-900 mb-6 leading-tight">
                    Contact Our <br/> <span className="text-earth-800">Expert Team</span>
                </h1>
                <p className="text-earth-700 text-lg leading-relaxed">
                    We'd love to hear from you. Whether you have a question about features, trials, or just want to say hi, our team is ready to answer all your questions.
                </p>
            </div>

            {/* Visual Image (Reusing the generated hero image for consistency with the design language) */}
            <div className="relative flex-1">
                 <img 
                    src="/agrinex photo.jpeg" 
                    alt="Contact Support" 
                    className="w-full h-auto drop-shadow-xl rounded-2xl"
                />
            </div>

            {/* Quick Contact Info */}
             <div className="flex flex-wrap gap-8 pt-4">
                <div className="flex items-center gap-3 text-earth-700 group cursor-pointer">
                    <div className="p-2 bg-earth-100 text-earth-700 rounded-lg group-hover:bg-earth-200 transition-colors">
                        <Mail size={20} />
                    </div>
                    <span className="font-medium group-hover:text-earth-800 transition-colors">support@verticalgrow.ai</span>
                </div>
                <div className="flex items-center gap-3 text-earth-700 group cursor-pointer">
                    <div className="p-2 bg-earth-100 text-earth-700 rounded-lg group-hover:bg-earth-200 transition-colors">
                         <Phone size={20} />
                    </div>
                    <span className="font-medium group-hover:text-earth-800 transition-colors">+1 (555) 123-4567</span>
                </div>
            </div>
        </div>

        {/* Right Side: Contact Form Card */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl border border-earth-200 relative space-y-10 flex flex-col h-full">
            <h2 className="text-3xl font-bold text-earth-900 mb-2">Send Message</h2>
            <p className="text-earth-700 mb-8">Fill out the form below and we'll get back to you shortly.</p>
            
            <form className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-earth-800 mb-2">Full Name</label>
                    <input 
                        type="text" 
                        className="w-full bg-white border border-earth-300 rounded-xl px-4 py-3 text-earth-900 focus:ring-2 focus:ring-earth-500 focus:border-earth-500 outline-none transition-all placeholder-earth-500" 
                        placeholder="John Doe" 
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-earth-800 mb-2">Email ID</label>
                    <input 
                        type="email" 
                        className="w-full bg-white border border-earth-300 rounded-xl px-4 py-3 text-earth-900 focus:ring-2 focus:ring-earth-500 focus:border-earth-500 outline-none transition-all placeholder-earth-500" 
                        placeholder="john@example.com" 
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-earth-800 mb-2">Mobile Number</label>
                        <input 
                            type="tel" 
                            className="w-full bg-white border border-earth-300 rounded-xl px-4 py-3 text-earth-900 focus:ring-2 focus:ring-earth-500 focus:border-earth-500 outline-none transition-all placeholder-earth-500" 
                            placeholder="+1 (555) 000-0000" 
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-earth-800 mb-2">Subject</label>
                        <select className="w-full bg-white border border-earth-300 rounded-xl px-4 py-3 text-earth-900 focus:ring-2 focus:ring-earth-500 focus:border-earth-500 outline-none transition-all">
                            <option>General Inquiry</option>
                            <option>Technical Support</option>
                            <option>Sales</option>
                            <option>Partnership</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-earth-800 mb-2">Message</label>
                    <textarea 
                        rows="4" 
                        className="w-full bg-white border border-earth-300 rounded-xl px-4 py-3 text-earth-900 focus:ring-2 focus:ring-earth-500 focus:border-earth-500 outline-none transition-all placeholder-earth-500 resize-none" 
                        placeholder="How can we help you?"
                    ></textarea>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-earth-700 hover:bg-earth-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-earth-900/20 flex items-center justify-center gap-2 mt-2"
                >
                    <Send size={20} /> Send Message
                </motion.button>
            </form>

            {/* Live Stream Link Setter */}
            <div className="pt-6 border-t border-earth-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-earth-100 text-earth-700">
                  <LinkIcon size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-earth-900">Set Live Stream Link</h3>
                  <p className="text-sm text-earth-700">Save the active YouTube live link for the Image Detection page.</p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSaveLiveLink}>
                <div>
                  <label className="block text-sm font-semibold text-earth-800 mb-2">YouTube Live Link</label>
                  <input
                    type="url"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="w-full bg-white border border-earth-300 rounded-xl px-4 py-3 text-earth-900 focus:ring-2 focus:ring-earth-500 focus:border-earth-500 outline-none transition-all placeholder-earth-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-earth-800 mb-2">Title (optional)</label>
                    <input
                      type="text"
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      className="w-full bg-white border border-earth-300 rounded-xl px-4 py-3 text-earth-900 focus:ring-2 focus:ring-earth-500 focus:border-earth-500 outline-none transition-all placeholder-earth-500"
                      placeholder="Live Workshop"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-earth-800 mb-2">Description (optional)</label>
                    <input
                      type="text"
                      value={liveDescription}
                      onChange={(e) => setLiveDescription(e.target.value)}
                      className="w-full bg-white border border-earth-300 rounded-xl px-4 py-3 text-earth-900 focus:ring-2 focus:ring-earth-500 focus:border-earth-500 outline-none transition-all placeholder-earth-500"
                      placeholder="Brief description"
                    />
                  </div>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: savingLink ? 1 : 1.01 }}
                  whileTap={{ scale: savingLink ? 1 : 0.99 }}
                  disabled={savingLink}
                  className="w-full bg-earth-700 hover:bg-earth-800 disabled:bg-earth-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
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
            
            <div className="mt-6 text-center pt-4 border-t border-earth-200">
                <p className="text-xs text-earth-600 mb-4">
                    By contacting us, you agree to our <span className="text-earth-700 font-medium cursor-pointer">Terms of Service</span> and <span className="text-earth-700 font-medium cursor-pointer">Privacy Policy</span>.
                </p>
                <img 
                    src="/team.jpeg" 
                    alt="Our Team" 
                    className="w-full h-auto drop-shadow-xl rounded-2xl mb-4"
                />
                <p className="text-sm font-semibold text-earth-800">
                     Voices from the Fields, Powered by Innovation
                </p>
            </div>
        </div>

      </div>
      
      {/* Simple Footer Links */}
      <div className="fixed bottom-4 left-0 w-full text-center pointer-events-none">
          <div className="inline-flex gap-4 text-xs text-earth-600 pointer-events-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-earth-200 shadow-sm">
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
