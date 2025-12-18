import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

const FarmContext = createContext();

// Configuration
const SOCKET_URL = 'https://aiot-vertical-farming-backend.onrender.com';
const API_URL = 'https://aiot-vertical-farming-backend.onrender.com/api';

// Safe thresholds
const THRESHOLDS = {
  temperature: 35, // Celsius
  humidity: 80, // Percent
  moistureLow: 30, // Percent
};

export const FarmProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [layers, setLayers] = useState({
    layer1: { id: 1, name: 'Top Layer (Lettuce)', temperature: 24, humidity: 60, moisture: 45, pumpInfo: { status: false } },
    layer2: { id: 2, name: 'Middle Layer (Basil)', temperature: 25, humidity: 62, moisture: 50, pumpInfo: { status: false } },
    layer3: { id: 3, name: 'Bottom Layer (Microgreens)', temperature: 23, humidity: 65, moisture: 55, pumpInfo: { status: false } }
  });
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Ref to keep track of previous values for alerts to avoid spamming
  const prevLayerState = useRef(layers);

  useEffect(() => {
    // Attempt to connect to backend
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 3,
      timeout: 5000
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      setIsDemoMode(false);
      toast.success('Connected to Farm System');
    });

    newSocket.on('connect_error', () => {
      console.log('Failed to connect to WebSocket, falling back to Demo Mode');
      setIsConnected(false);
      setIsDemoMode(true);
    });

    newSocket.on('farm_data', (data) => {
      // Expecting data structure matching layers
      updateLayers(data);
    });

    // Cleanup
    return () => newSocket.close();
  }, []);

  // Demo Mode Simulation
  useEffect(() => {
    if (!isDemoMode) return;

    const interval = setInterval(() => {
      setLayers(prev => {
        const nextState = { ...prev };
        const timestamp = new Date().toISOString();
        const newHistoryPoint = { time: timestamp };

        Object.keys(nextState).forEach(key => {
          const layer = nextState[key];
          // Random fluctuations
          const tempChange = (Math.random() - 0.5) * 0.5;
          const humChange = (Math.random() - 0.5) * 1;
          const moistChange = layer.pumpInfo.status ? 1.5 : -0.2; // Increases if pump is on, decreases otherwise

          layer.temperature = Math.max(0, Math.min(50, parseFloat((layer.temperature + tempChange).toFixed(1))));
          layer.humidity = Math.max(0, Math.min(100, parseFloat((layer.humidity + humChange).toFixed(1))));
          layer.moisture = Math.max(0, Math.min(100, parseFloat((layer.moisture + moistChange).toFixed(1))));

          newHistoryPoint[`${key}_moisture`] = layer.moisture;
        });

        // Check for alerts
        checkAlerts(nextState);
        
        // Update history
        setHistory(prevHist => {
          const newHist = [...prevHist, newHistoryPoint];
          if (newHist.length > 20) newHist.shift(); // Keep last 20 points
          return newHist;
        });

        return nextState;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  const updateLayers = (newData) => {
    setLayers(prev => {
        const updated = { ...prev, ...newData };
        checkAlerts(updated);
        return updated;
    });
    
    // Update history logic would go here for real data
  };

  const checkAlerts = (currentLayers) => {
    Object.keys(currentLayers).forEach(key => {
      const layer = currentLayers[key];
      if (layer.temperature > THRESHOLDS.temperature && prevLayerState.current[key].temperature <= THRESHOLDS.temperature) {
        toast.error(`High Temperature Alert: ${layer.name} is ${layer.temperature}°C!`);
      }
      if (layer.humidity > THRESHOLDS.humidity && prevLayerState.current[key].humidity <= THRESHOLDS.humidity) {
        toast.error(`High Humidity Alert: ${layer.name} is ${layer.humidity}%!`);
      }
    });
    prevLayerState.current = currentLayers;
  };

  const togglePump = async (layerId) => {
    const layerKey = Object.keys(layers).find(key => layers[key].id === layerId);
    if (!layerKey) return;

    const currentStatus = layers[layerKey].pumpInfo.status;
    const newStatus = !currentStatus;

    // Optimistic update
    setLayers(prev => ({
      ...prev,
      [layerKey]: {
        ...prev[layerKey],
        pumpInfo: { ...prev[layerKey].pumpInfo, status: newStatus }
      }
    }));

    if (!isDemoMode && socket) {
      // Send command to backend
      socket.emit('toggle_pump', { layerId, status: newStatus });
      try {
          // Optional: Axios call if REST is preferred for control
          // await axios.post(`${API_URL}/control`, { layerId, status: newStatus });
      } catch (error) {
          console.error("Failed to toggle pump", error);
          toast.error("Failed to allow pump toggle");
          // Revert on failure
             setLayers(prev => ({
              ...prev,
              [layerKey]: {
                ...prev[layerKey],
                pumpInfo: { ...prev[layerKey].pumpInfo, status: currentStatus }
              }
            }));
      }
    } else {
        toast(newStatus ? `Pump for ${layers[layerKey].name} Activated` : `Pump for ${layers[layerKey].name} Deactivated`, {
            icon: newStatus ? '🌊' : '🛑',
        });
    }
  };

  return (
    <FarmContext.Provider value={{ layers, history, togglePump, isConnected, isDemoMode }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
