import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

const FarmContext = createContext();

// Configuration
const SOCKET_URL = 'https://aiot-vertical-farming-backend.onrender.com';
const DATA_API_URL = 'https://aiot-vertical-farming-backend.onrender.com/get_temperature';

// Safe thresholds
const THRESHOLDS = {
  temperature: 30, // Celsius
  humidity: 80, // Percent
  moistureLow: 20, // Percent
  gasHigh: 2000, 
};

export const FarmProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [layers, setLayers] = useState({
    layer1: { id: 1, name: 'Black Soil', temperature: 0, humidity: 0, moisture: 0, gas: 0, light: 0, pumpInfo: { status: false } },
    layer2: { id: 2, name: 'Red Soil', temperature: 0, humidity: 0, moisture: 0, gas: 0, light: 0, pumpInfo: { status: false } },
    layer3: { id: 3, name: 'Sand', temperature: 0, humidity: 0, moisture: 0, gas: 0, light: 0, pumpInfo: { status: false } }
  });
  const [lastUpdated, setLastUpdated] = useState('');
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Ref to keep track of previous values for alerts to avoid spamming
  const prevLayerState = useRef(layers);

  // Initial Socket Connection (Optional for real-time control if backend supports it)
  useEffect(() => {
    // Keep socket mainly for connectivity check or future use
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 3,
      timeout: 5000
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });
    
    newSocket.on('connect_error', (err) => {
        console.log('Socket connect error', err);
    });

    return () => newSocket.close();
  }, []);

  // Polling Data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(DATA_API_URL);
        const data = response.data;
        
        if (data) {
          setIsConnected(true);
          setIsDemoMode(false);
          updateLayersFromApi(data);
          if (data.timestamp) {
              // Convert ISO timestamp to readable format
              const timestamp = new Date(data.timestamp);
              setLastUpdated(timestamp.toLocaleString());
          }
        }
      } catch (error) {
        console.error("Error fetching farm data:", error);
        if (!isConnected) {
             setIsDemoMode(true); 
        }
      }
    };

    // Fetch immediately
    fetchData();

    // Poll every 3 seconds
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateLayersFromApi = (apiData) => {
    setLayers(prev => {
        const newLayers = { ...prev };
        
        // New API structure: { zones: [{ id, soil, temperature, humidity, gas, light }, ...], timestamp }
        if (apiData.zones && Array.isArray(apiData.zones)) {
            // Process zones array
            apiData.zones.forEach(zone => {
                const zoneId = zone.id;
                let layerKey = null;
                
                // Map zone id to layer key
                if (zoneId === 1) layerKey = 'layer1';
                else if (zoneId === 2) layerKey = 'layer2';
                else if (zoneId === 3) layerKey = 'layer3';
                
                if (layerKey && newLayers[layerKey]) {
                    newLayers[layerKey] = {
                        ...newLayers[layerKey],
                        temperature: zone.temperature !== undefined ? zone.temperature : newLayers[layerKey].temperature,
                        humidity: zone.humidity !== undefined ? zone.humidity : newLayers[layerKey].humidity,
                        moisture: zone.soil !== undefined ? zone.soil : newLayers[layerKey].moisture,
                        gas: zone.gas !== undefined ? zone.gas : newLayers[layerKey].gas,
                        light: zone.light !== undefined ? zone.light : newLayers[layerKey].light,
                        // Note: motor/pump status is not included in GET response
                        // pumpInfo status remains unchanged (controlled separately)
                    };
                }
            });
        } else {
            // Fallback: Handle old structure (zone1, zone2, zone3) for backward compatibility
            const mapZone = (zoneData, existingLayer) => {
                if (!zoneData) return existingLayer;
                return {
                    ...existingLayer,
                    temperature: zoneData.temp !== undefined ? zoneData.temp : (zoneData.temperature !== undefined ? zoneData.temperature : existingLayer.temperature),
                    humidity: zoneData.hum !== undefined ? zoneData.hum : (zoneData.humidity !== undefined ? zoneData.humidity : existingLayer.humidity),
                    moisture: zoneData.soil !== undefined ? zoneData.soil : existingLayer.moisture,
                    gas: zoneData.gas !== undefined ? zoneData.gas : existingLayer.gas,
                    light: zoneData.light !== undefined ? zoneData.light : existingLayer.light,
                };
            };

            newLayers.layer1 = mapZone(apiData.zone1, newLayers.layer1);
            newLayers.layer2 = mapZone(apiData.zone2, newLayers.layer2);
            newLayers.layer3 = mapZone(apiData.zone3, newLayers.layer3);
        }

        checkAlerts(newLayers);
        return newLayers;
    });
  };

  // Demo Mode Simulation (Fallback)
  useEffect(() => {
    if (!isDemoMode) return;

    const interval = setInterval(() => {
      setLayers(prev => {
        const nextState = { ...prev };
        
        Object.keys(nextState).forEach(key => {
          const layer = nextState[key];
          // Random fluctuations around a "healthy" mean
          const tempChange = (Math.random() - 0.5) * 0.5;
          const humChange = (Math.random() - 0.5) * 1;
          const moistChange = layer.pumpInfo.status ? 1.5 : -0.2;

          layer.temperature = Math.max(18, Math.min(35, parseFloat((layer.temperature || 24 + tempChange).toFixed(1))));
          layer.humidity = Math.max(40, Math.min(90, parseFloat((layer.humidity || 60 + humChange).toFixed(1))));
          layer.moisture = Math.max(0, Math.min(100, parseFloat((layer.moisture || 50 + moistChange).toFixed(1))));
          layer.gas = 4095; // Default from example
          layer.light = 0;
        });

        return nextState;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  const checkAlerts = (currentLayers) => {
    Object.keys(currentLayers).forEach(key => {
      const layer = currentLayers[key];
      if (layer.temperature > THRESHOLDS.temperature && prevLayerState.current[key].temperature <= THRESHOLDS.temperature) {
        toast.error(`High Temp in ${layer.name}: ${layer.temperature}°C`);
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
    
    toast.success(`Pump command sent: ${newStatus ? 'ON' : 'OFF'}`);
  };

  return (
    <FarmContext.Provider value={{ layers, history, togglePump, isConnected, isDemoMode, lastUpdated }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
