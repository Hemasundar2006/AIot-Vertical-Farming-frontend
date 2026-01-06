import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

// Now expects a direct HLS streamUrl from the backend
const LiveAnalyzer = ({ streamUrl }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [data, setData] = useState({ wavelength: 0, nutrient: 'Initializing...' });
  const [status, setStatus] = useState('Waiting for stream URL...');
  const [error, setError] = useState('');
  const hlsRef = useRef(null);

  useEffect(() => {
    if (!streamUrl) {
      setStatus('Waiting for stream URL...');
      return;
    }

    const fetchStream = async () => {
      try {
        setStatus('Requesting stream URL...');
        setError('');

        // Clean up any previous instance
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }

        if (Hls.isSupported()) {
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => setStatus('Streaming...'));
          hls.on(Hls.Events.ERROR, (evt, data) => {
            setStatus('Stream error');
            setError(data?.details || 'HLS error');
          });
        } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = streamUrl;
          setStatus('Streaming...');
        } else {
          setStatus('HLS not supported in this browser');
        }
      } catch (err) {
        console.error('Failed to fetch stream:', err);
        setStatus('Failed to load stream');
        setError(err?.message || 'Unknown error');
      }
    };

    fetchStream();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl]);

  const analyzePixels = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || video.paused || video.ended || !video.videoWidth) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Match canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the hidden canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Grab a 100x100 square from the center of the video
    const sampleSize = 100;
    const startX = canvas.width / 2 - sampleSize / 2;
    const startY = canvas.height / 2 - sampleSize / 2;
    const pixelData = ctx.getImageData(startX, startY, sampleSize, sampleSize).data;

    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      r += pixelData[i];
      g += pixelData[i + 1];
      b += pixelData[i + 2];
    }

    const totalPixels = pixelData.length / 4;
    const avgR = r / totalPixels;
    const avgG = g / totalPixels;
    const avgB = b / totalPixels;

    // Proxy wavelength formula
    const wl = (avgR * 660 + avgG * 530 + avgB * 470) / (avgR + avgG + avgB || 1);

    // Nutrient mapping
    let nut = 'Unknown';
    if (wl >= 450 && wl <= 495) nut = 'Nitrogen (N)';
    else if (wl > 495 && wl <= 570) nut = 'Phosphorus (P)';
    else if (wl >= 620 && wl <= 700) nut = 'Potassium (K)';

    setData({ wavelength: wl.toFixed(2), nutrient: nut });
  };

  // Run analysis every 2 seconds
  useEffect(() => {
    const interval = setInterval(analyzePixels, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          crossOrigin="anonymous"
          style={{ width: '100%', maxWidth: '900px', borderRadius: '12px', background: '#0b1324' }}
        />
        {/* Visual Overlay to show where we are measuring */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100px',
            height: '100px',
            border: '2px dashed yellow',
            pointerEvents: 'none',
          }}
        ></div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div
        style={{
          marginTop: '16px',
          color: '#475569',
          fontSize: '14px',
        }}
      >
        <strong>Status:</strong> {status}
        {error ? ` — ${error}` : ''}
      </div>

      <div
        style={{
          marginTop: '12px',
          padding: '20px',
          background: '#f4f4f4',
          borderRadius: '8px',
        }}
      >
        <h2>Live NPK Analysis</h2>
        <p>
          <strong>Proxy Wavelength:</strong> {data.wavelength} nm
        </p>
        <p>
          <strong>Dominant Nutrient Signal:</strong>{' '}
          <span style={{ color: 'green' }}>{data.nutrient}</span>
        </p>
      </div>
    </div>
  );
};

export default LiveAnalyzer;