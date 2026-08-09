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
    layer1: { id: 1, name: 'Black Soil', temperature: 0, humidity: 0, moisture: 0, gas: 0, light: 0, motor: 'OFF', pumpInfo: { status: false } },
    layer2: { id: 2, name: 'Red Soil', temperature: 0, humidity: 0, moisture: 0, gas: 0, light: 0, motor: 'OFF', pumpInfo: { status: false } },
    layer3: { id: 3, name: 'Sand', temperature: 0, humidity: 0, moisture: 0, gas: 0, light: 0, motor: 'OFF', pumpInfo: { status: false } }
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

  const resetLayersToOffline = () => {
    setLayers(prev => {
      const resetState = { ...prev };
      Object.keys(resetState).forEach(key => {
        resetState[key] = {
          ...resetState[key],
          temperature: 0,
          humidity: 0,
          moisture: 0,
          gas: 0,
          light: 0,
          motor: 'OFF',
          pumpInfo: { status: false }
        };
      });
      return resetState;
    });
  };

  // Polling Data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(DATA_API_URL);
        const data = response.data;
        
        if (data) {
          setIsDemoMode(false);
          let isFresh = true;
          if (data.timestamp) {
              const timestamp = new Date(data.timestamp);
              setLastUpdated(timestamp.toLocaleString());
              // Check if timestamp is fresh (within 90 seconds)
              isFresh = (new Date() - timestamp) < 90000;
          }

          setIsConnected(isFresh);

          if (isFresh) {
            updateLayersFromApi(data);
          } else {
            resetLayersToOffline();
          }
        } else {
          setIsConnected(false);
          setIsDemoMode(false);
          resetLayersToOffline();
        }
      } catch (error) {
        console.error("Error fetching farm data:", error);
        setIsConnected(false);
        setIsDemoMode(false);
        resetLayersToOffline();
      }
    };

    // Fetch immediately
    fetchData();

    // Poll every 3 seconds
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateLayersFromApi = (apiData) => {
    if (!apiData) return;

    let zonesList = [];
    const root = apiData.data || apiData;

    if (Array.isArray(root)) {
      zonesList = root;
    } else if (Array.isArray(root.zones)) {
      zonesList = root.zones;
    } else if (root.id !== undefined) {
      zonesList = [root];
    } else if (typeof root === 'object') {
      ['zone1', 'zone2', 'zone3', 'z1', 'z2', 'z3', '1', '2', '3'].forEach((k) => {
        if (root[k] && typeof root[k] === 'object') {
          const numId = Number(k.replace(/\D/g, '')) || (k === 'zone1' || k === 'z1' ? 1 : k === 'zone2' || k === 'z2' ? 2 : 3);
          zonesList.push({ id: numId, ...root[k] });
        }
      });
    }

    setLayers(prev => {
        const newLayers = { ...prev };
        
        zonesList.forEach(zone => {
            if (!zone || typeof zone !== 'object') return;

            const zoneId = Number(zone.id || zone.zoneId || (zone.zone ? String(zone.zone).replace(/\D/g, '') : null));
            let layerKey = null;
            
            // Map zone id to layer key
            if (zoneId === 1) layerKey = 'layer1';
            else if (zoneId === 2) layerKey = 'layer2';
            else if (zoneId === 3) layerKey = 'layer3';
            
            if (layerKey && newLayers[layerKey]) {
                const rawMotor = zone.motor !== undefined ? zone.motor : (zone.relay !== undefined ? zone.relay : zone.motor_status);
                let motorState = newLayers[layerKey].motor || 'OFF';

                if (rawMotor !== undefined && rawMotor !== null) {
                  const strVal = String(rawMotor).trim().toUpperCase();
                  if (strVal === 'ON' || strVal === 'TRUE' || rawMotor === true || rawMotor === 1) {
                    motorState = 'ON';
                  } else {
                    motorState = 'OFF';
                  }
                }

                const isMotorOn = motorState === 'ON';

                newLayers[layerKey] = {
                    ...newLayers[layerKey],
                    temperature: zone.temperature !== undefined ? zone.temperature : (zone.temp !== undefined ? zone.temp : newLayers[layerKey].temperature),
                    humidity: zone.humidity !== undefined ? zone.humidity : (zone.hum !== undefined ? zone.hum : newLayers[layerKey].humidity),
                    moisture: zone.soil !== undefined ? zone.soil : (zone.moisture !== undefined ? zone.moisture : newLayers[layerKey].moisture),
                    gas: zone.gas !== undefined ? zone.gas : newLayers[layerKey].gas,
                    light: zone.light !== undefined ? zone.light : newLayers[layerKey].light,
                    motor: motorState,
                    pumpInfo: {
                      ...newLayers[layerKey].pumpInfo,
                      status: isMotorOn
                    }
                };
            }
        });

        checkAlerts(newLayers);
        return newLayers;
    });
  };

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
    const newMotorState = newStatus ? 'ON' : 'OFF';

    // Optimistic update
    setLayers(prev => ({
      ...prev,
      [layerKey]: {
        ...prev[layerKey],
        motor: newMotorState,
        pumpInfo: { ...prev[layerKey].pumpInfo, status: newStatus }
      }
    }));
    
    toast.success(`Motor command sent for ${layers[layerKey].name}: ${newMotorState}`);
  };

  return (
    <FarmContext.Provider value={{ layers, history, togglePump, isConnected, isDemoMode, lastUpdated }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
