import React, { useEffect, useState, useMemo } from 'react';
import { Camera, Video, Activity, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'https://aiot-vertical-farming-backend.onrender.com';

const toEmbedUrl = (url) => {
  if (!url) return null;
  try {
    // If already embed
    if (url.includes('youtube.com/embed/')) return url;
    // Live link variant
    if (url.includes('youtube.com/live/')) {
      const id = url.split('youtube.com/live/')[1]?.split(/[?&]/)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    // Watch link
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
    }
    // Shorts or other path with /shorts/ID
    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('youtube.com/shorts/')[1]?.split(/[?&]/)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    // Fallback to original
    return url;
  } catch (e) {
    return null;
  }
};

const ImageDetection = () => {
  const [liveLink, setLiveLink] = useState(null);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDescription, setLiveDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLiveLink = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/api/live/get-link`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch live link');
        }
        if (data.data && data.data.youtubeLink) {
          setLiveLink(data.data.youtubeLink);
          setLiveTitle(data.data.title || 'Live Workshop Stream');
          setLiveDescription(data.data.description || 'Watch the live session directly inside your dashboard');
        } else {
          setLiveLink(null);
          setLiveTitle('No active live stream');
          setLiveDescription('Please set a YouTube live link from the Contact page.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch live link');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveLink();
  }, []);

  const embedUrl = useMemo(() => toEmbedUrl(liveLink) || 'https://www.youtube.com/embed/D8-BrAt9GDE', [liveLink]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 pt-28 pb-12 px-4 lg:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Camera size={14} /> Live Image Detection
          </motion.div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            {liveTitle || 'Live Workshop'} <span className="text-blue-600">Stream</span>
          </h1>
          <p className="text-slate-500 text-lg">
            {liveDescription || 'Watch the YouTube live session directly inside your dashboard'}
          </p>
        </div>

        {/* Live Stream Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Video className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">Live Workshop Stream</h2>
              <p className="text-slate-500 text-sm">Real-time video feed from the vertical farming system</p>
            </div>
          </div>

          {/* YouTube Live Stream Embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
                <Activity className="animate-spin text-blue-600" size={24} />
                <span className="ml-2 text-sm text-slate-600">Loading live stream...</span>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 rounded-xl border border-red-100 text-red-700 text-center px-4">
                <AlertTriangle size={24} className="mb-2" />
                <p className="text-sm font-semibold">Failed to load live stream</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
            ) : (
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                src={embedUrl}
                title="YouTube live stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>

          {/* Status Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-medium">Live</span>
          </div>
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Camera className="text-blue-600" size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Image Detection</h3>
            </div>
            <p className="text-sm text-slate-600">
              Real-time monitoring and analysis of crop images for disease detection and growth tracking
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Activity className="text-emerald-600" size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Live Analysis</h3>
            </div>
            <p className="text-sm text-slate-600">
              Continuous AI-powered analysis of plant health, growth patterns, and environmental conditions
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Video className="text-purple-600" size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Workshop Feed</h3>
            </div>
            <p className="text-sm text-slate-600">
              Watch live demonstrations and learn about vertical farming techniques and best practices
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageDetection;

