import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Upload, Camera, AlertTriangle, CheckCircle2, Loader2,
  Info, ChevronDown, ChevronUp, X, Microscope,
  ShieldCheck, Bug, Droplets, RefreshCw, Video, Wifi, WifiOff,
  PlayCircle, StopCircle, Link, Scan
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = 'https://leaf-detection-imgp.onrender.com';
const STREAM_BASE = 'https://leaf-detection-imgp.onrender.com';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const parsePrediction = (raw) => {
  if (!raw) return null;
  if (typeof raw === 'object' && raw.prediction) {
    return { className: raw.prediction.replace(/_+/g, ' '), confidence: null, raw: raw.prediction };
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.prediction) return { className: parsed.prediction.replace(/_+/g, ' '), confidence: null, raw: parsed.prediction };
      const str = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
      return { className: str.replace(/_+/g, ' '), confidence: null, raw: str };
    } catch {
      return { className: raw.replace(/_+/g, ' '), confidence: null, raw };
    }
  }
  return { className: String(raw).replace(/_+/g, ' '), confidence: null, raw: String(raw) };
};

const isHealthy = (pred) => {
  if (!pred) return false;
  const lower = pred.raw?.toLowerCase() || '';
  return lower.includes('healthy') && !lower.includes('unhealthy');
};

const TabButton = ({ active, onClick, icon: Icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
      active ? 'bg-[#213E20] text-white shadow-lg' : 'bg-white/80 text-gray-600 hover:bg-gray-100 border border-gray-200'
    }`}
  >
    <Icon size={15} />
    {label}
    {badge && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#C49E40] text-white">{badge}</span>}
  </button>
);

const DropZone = ({ file, setFile, onAnalyze, loading }) => {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped && dropped.type.startsWith('image/')) setFile(dropped);
    else toast.error('Please upload a valid image file');
  }, [setFile]);

  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <motion.div variants={fadeInUp} className="relative">
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[320px] group ${
            isDragOver ? 'border-[#C49E40] bg-[#C49E40]/5' : 'border-gray-200 hover:border-[#213E20]/40 bg-gray-50/50 hover:bg-gray-50'
          }`}
        >
          <motion.div
            animate={isDragOver ? { scale: 1.15, rotate: 8 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-3xl bg-[#213E20]/8 flex items-center justify-center text-[#213E20] mb-6"
          >
            <Upload size={32} />
          </motion.div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            {isDragOver ? 'Drop your image here' : 'Upload a leaf image'}
          </h3>
          <p className="text-sm text-gray-500 font-medium mb-6 text-center max-w-xs">
            Drag and drop or click to browse. Supports JPG, PNG, WEBP.
          </p>
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#213E20] text-white text-xs font-bold uppercase tracking-wider shadow-md">
            <Camera size={14} /> Choose File
          </div>
          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} className="hidden" />
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
          <div className="relative aspect-[4/3] max-h-[420px] flex items-center justify-center bg-black/5">
            <img src={previewUrl} alt="Leaf preview" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="p-6 flex items-center justify-between gap-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#213E20]/8 flex items-center justify-center text-[#213E20] shrink-0">
                <Leaf size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-400 font-medium">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setFile(null)} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
              <motion.button
                onClick={onAnalyze}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2.5 rounded-full bg-[#C49E40] text-white font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-[#b38f3a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Analyzing...</> : <><Microscope size={14} /> Analyze</>}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ResultCard = ({ prediction }) => {
  const pred = parsePrediction(prediction);
  if (!pred) return null;
  const healthy = isHealthy(pred);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`rounded-3xl p-8 border shadow-md relative overflow-hidden ${
        healthy ? 'bg-gradient-to-br from-green-50 to-emerald-50/50 border-green-200' : 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200'
      }`}
    >
      <div className="absolute top-4 right-4 opacity-[0.06] pointer-events-none">
        {healthy ? <ShieldCheck size={100} /> : <Bug size={100} />}
      </div>
      <div className="flex items-start gap-5 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${healthy ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}
        >
          {healthy ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className={`text-[11px] font-black uppercase tracking-widest mb-1 ${healthy ? 'text-green-600' : 'text-amber-600'}`}>
            {healthy ? 'Healthy Plant' : 'Disease Detected'}
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">{pred.className}</h3>
          <p className="text-sm text-gray-500 font-medium">
            {healthy
              ? 'Your plant looks healthy! Keep maintaining good growing conditions for optimal yield.'
              : 'A potential disease has been identified. Consider consulting an agronomist for treatment recommendations.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ClassesSection = ({ classes }) => {
  const [open, setOpen] = useState(false);
  if (!classes || classes.length === 0) return null;
  return (
    <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#213E20]/8 flex items-center justify-center text-[#213E20]"><Info size={17} /></div>
          <div className="text-left">
            <p className="font-bold text-gray-900 text-sm">Supported Plant Classes</p>
            <p className="text-xs text-gray-400 font-medium">{classes.length} disease categories</p>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-5 pb-5">
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {classes.map((cls, i) => {
                  const displayName = typeof cls === 'string' ? cls.replace(/_+/g, ' ') : String(cls);
                  const classHealthy = displayName.toLowerCase().includes('healthy') && !displayName.toLowerCase().includes('unhealthy');
                  return (
                    <span key={i} className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider border ${classHealthy ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {displayName}
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LiveStreamPanel = () => {
  const [cameraUrl, setCameraUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [streamActive, setStreamActive] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Stream goes through local Flask — Render server cannot reach your local IP camera
  const streamSrc = activeUrl ? `${STREAM_BASE}/stream_video?url=${encodeURIComponent(activeUrl)}` : '';

  const handleStart = () => {
    const trimmed = cameraUrl.trim();
    if (!trimmed) return toast.error('Please enter a camera stream URL');
    try { new URL(trimmed); } catch { return toast.error('Please enter a valid URL (e.g. http://192.168.x.x:8080/video)'); }
    
    setImgError(false);
    setActiveUrl(trimmed);
    setStreamActive(true);
    toast.success('Connecting to camera stream...');
  };

  const handleStop = () => { setStreamActive(false); setActiveUrl(''); setImgError(false); };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#213E20]/8 flex items-center justify-center text-[#213E20]"><Link size={18} /></div>
          <div>
            <p className="font-bold text-gray-900 text-sm">IP Webcam / Camera URL</p>
            <p className="text-xs text-gray-400 font-medium">Enter the MJPEG stream URL from your IP camera app</p>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="url"
            value={cameraUrl}
            onChange={(e) => setCameraUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="http://192.168.1.x:8080/video"
            className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#C49E40] focus:outline-none text-sm font-medium text-gray-800 placeholder-gray-400 transition-colors"
          />
          {!streamActive ? (
            <motion.button onClick={handleStart} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#213E20] hover:bg-[#152a16] text-white text-sm font-bold transition-colors shadow-md">
              <Wifi size={16} /> Connect
            </motion.button>
          ) : (
            <motion.button onClick={handleStop} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-md">
              <WifiOff size={16} /> Disconnect
            </motion.button>
          )}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700 font-bold mb-1 flex items-center gap-1.5"><Info size={12} /> How to get your IP camera URL</p>
          <ul className="text-xs text-blue-600 font-medium space-y-0.5 list-disc list-inside">
            <li>Install <strong>IP Webcam</strong> app on your Android phone</li>
            <li>Start the server in the app and note the IP address shown</li>
            <li>Enter the URL like: <code className="font-mono bg-blue-100 px-1 rounded">http://192.168.x.x:8080/video</code></li>
            <li>Make sure your phone and PC are on the <strong>same Wi-Fi network</strong></li>
          </ul>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600"><Video size={17} /></div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Live Feed with AI Detection</p>
              <p className="text-xs text-gray-400 font-medium">Disease predictions are rendered directly on frames</p>
            </div>
          </div>
          {streamActive && !imgError && (
            <div className="flex items-center gap-4">
              <a
                href={streamSrc}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-blue-600 underline hover:text-blue-800"
              >
                Open Stream in New Tab
              </a>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live</span>
              </div>
            </div>
          )}
        </div>
        <div className="relative bg-gray-900 min-h-[380px] flex items-center justify-center">
          {!streamActive ? (
            <div className="flex flex-col items-center gap-4 text-gray-500 py-16">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center"><Camera size={28} className="text-gray-600" /></div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-400">No stream active</p>
                <p className="text-xs text-gray-600 mt-1">Enter your camera URL above and click Connect</p>
              </div>
            </div>
          ) : imgError ? (
            <div className="flex flex-col items-center gap-4 text-gray-500 py-16">
              <div className="w-16 h-16 rounded-2xl bg-red-900/30 flex items-center justify-center"><WifiOff size={28} className="text-red-400" /></div>
              <div className="text-center">
                <p className="text-sm font-bold text-red-400">Stream connection failed</p>
                <p className="text-xs text-gray-500 mt-1">Check the URL or ensure the Flask server is running</p>
                <button
                  onClick={() => { setImgError(false); const u = cameraUrl; setActiveUrl(''); setTimeout(() => setActiveUrl(u), 100); }}
                  className="mt-3 flex items-center gap-1.5 mx-auto px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors"
                >
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full">
              <img
                key={streamSrc}
                src={streamSrc}
                alt="Live camera feed with disease prediction"
                className="w-full object-contain max-h-[520px]"
                onError={() => setImgError(true)}
              />
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Scan size={12} className="text-[#C49E40]" />
                <span className="text-[11px] font-black text-white uppercase tracking-wider">AI Scanning</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="bg-[#213E20] rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#C49E40]/20 flex items-center justify-center shrink-0"><Wifi size={18} className="text-[#C49E40]" /></div>
          <div>
            <h4 className="font-extrabold mb-1 text-sm">Live Disease Detection on Camera Streams</h4>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              The Flask AI server processes each frame from your IP camera in real time and burns the disease prediction label directly onto the video. Make sure the server at <code className="font-mono text-[#C49E40]">leaf-detection-imgp.onrender.com</code> is running before connecting.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PlantAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [classes] = useState([]);

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please select an image first');
    setLoading(true);
    setPrediction(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/predict_image`, { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.detail?.[0]?.msg || 'Prediction failed');
      }
      const data = await res.json();
      setPrediction(data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-agri-light pt-28 pb-24 px-6 lg:px-12 relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-[#C49E40]/5 blur-3xl" animate={{ y: [0, -25, 0], x: [0, 15, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-20 -right-32 w-[480px] h-[480px] rounded-full bg-[#213E20]/4 blur-3xl" animate={{ y: [0, 20, 0], x: [0, -10, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div className="text-center max-w-3xl mx-auto mb-10" initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#213E20]/6 text-[#213E20] rounded-full text-[11px] font-black uppercase tracking-widest mb-5 border border-[#213E20]/10">
            <Microscope size={13} className="text-[#C49E40]" /> Plant Disease Detection
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5">
            Plant <span className="text-gradient-animated">Analyzer</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-gray-600 font-medium leading-relaxed">
            Upload a leaf photo or connect your IP camera for real-time AI disease detection.
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex items-center justify-center gap-3 mb-8">
          <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={Upload} label="Image Upload" />
          <TabButton active={activeTab === 'live'} onClick={() => setActiveTab('live')} icon={Video} label="Live Camera" badge="NEW" />
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div key="upload" initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} variants={stagger} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <DropZone file={file} setFile={setFile} onAnalyze={handleAnalyze} loading={loading} />
                <AnimatePresence>
                  {loading && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-center gap-3 py-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="relative">
                        <Loader2 size={24} className="animate-spin text-[#C49E40]" />
                        <div className="absolute inset-0 animate-ping"><Leaf size={24} className="text-[#213E20]/20" /></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Analyzing your leaf...</p>
                        <p className="text-xs text-gray-400 font-medium">This may take a few seconds</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {prediction && !loading && <ResultCard prediction={prediction} />}
                </AnimatePresence>
                <ClassesSection classes={classes} />
              </div>

              <div className="space-y-6">
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <Droplets size={16} className="text-[#C49E40]" /> Tips for Best Results
                  </h3>
                  <ul className="space-y-3">
                    {['Use natural light — avoid flash','Capture the full leaf in frame','Focus on affected areas if visible','Use a plain background if possible','Avoid blurry or low-resolution photos'].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500 font-medium">
                        <CheckCircle2 size={14} className="text-[#213E20] shrink-0 mt-0.5" />{tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={fadeInUp} className="bg-[#213E20] rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-[#C49E40]/20 flex items-center justify-center mb-4"><Leaf size={20} className="text-[#C49E40]" /></div>
                    <h4 className="font-extrabold mb-2">AI-Powered Detection</h4>
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">Our deep learning model is trained on thousands of leaf images across multiple crop species to accurately detect common plant diseases.</p>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3">API Endpoint</p>
                  <div className="bg-gray-50 rounded-xl p-3 font-mono text-xs text-gray-600 break-all">POST /predict_image</div>
                  <p className="text-[11px] text-gray-400 font-medium mt-2">Returns: <code className="font-mono bg-gray-100 px-1 rounded">{"{ prediction: \"Class_Name\" }"}</code></p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="live" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <LiveStreamPanel />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          {[
            { icon: Microscope, title: 'Instant Analysis', desc: 'Upload a leaf image and receive disease identification results in seconds.' },
            { icon: Video, title: 'Live Camera Stream', desc: 'Connect your IP Webcam for real-time frame-by-frame AI disease prediction.' },
            { icon: ShieldCheck, title: 'High Accuracy', desc: 'Trained on diverse datasets with state-of-the-art deep learning for reliable diagnoses.' },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={scaleIn} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm group flex flex-col">
              <div className="w-11 h-11 rounded-xl bg-[#213E20]/8 flex items-center justify-center text-[#213E20] group-hover:bg-[#213E20] group-hover:text-[#C49E40] transition-all duration-300 mb-4"><Icon size={20} /></div>
              <h4 className="font-extrabold text-gray-900 mb-1">{title}</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PlantAnalyzer;
