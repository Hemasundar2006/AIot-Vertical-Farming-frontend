import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

const FarmContext = createContext();

const RAW_BASE = import.meta.env?.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com';
const API_BASE = RAW_BASE.replace(/\/api\/?$/, '');
const SOCKET_URL = API_BASE;
const DATA_API_URL = `${API_BASE}/get_temperature`;
const ZONE3_API_URL = `${API_BASE}/api/zone3/latest`;

export const FarmProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [layers, setLayers] = useState({
    layer1: { id: 1, name: 'Black Soil', temperature: null, humidity: null, moisture: null, gas: null, light: null, motor: 'OFF', pumpInfo: { status: false }, isLive: false, timestamp: null },
    layer2: { id: 2, name: 'Red Soil', temperature: null, humidity: null, moisture: null, gas: null, light: null, motor: 'OFF', pumpInfo: { status: false }, isLive: false, timestamp: null },
    layer3: { id: 3, name: 'Sand (Zone 3)', temperature: null, humidity: null, moisture: null, gas: null, light: null, motor: 'OFF', pumpInfo: { status: false }, isLive: false, timestamp: null }
  });
  const [lastUpdated, setLastUpdated] = useState('');
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const manualOverrides = useRef({});

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 3,
      timeout: 5000
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = Date.now();
        const FRESH_WINDOW_MS = 180000; // 3 minutes

        // 1. Fetch Zones 1 & 2 from /get_temperature
        let zonesData = [];
        let rootTimestamp = null;
        try {
          const res = await axios.get(DATA_API_URL, { timeout: 4000 });
          if (res.data?.zones && Array.isArray(res.data.zones)) {
            zonesData = res.data.zones;
            rootTimestamp = res.data.timestamp;
          }
        } catch (err) {}

        // 2. Fetch Zone 3 from dedicated /api/zone3/latest
        let zone3Data = null;
        try {
          const z3Res = await axios.get(ZONE3_API_URL, { timeout: 4000 });
          if (z3Res.data?.data) {
            zone3Data = z3Res.data.data;
          }
        } catch (err) {}

        setLayers(prev => {
          const newLayers = { ...prev };

          // Zones 1 & 2 (ESP32 #1)
          zonesData.forEach(z => {
            const id = Number(z.id || z.zoneId);
            const layerKey = id === 1 ? 'layer1' : id === 2 ? 'layer2' : null;
            if (!layerKey || !newLayers[layerKey]) return;

            const curr = newLayers[layerKey];
            const rawTs = z.timestamp || rootTimestamp;
            const ts = rawTs ? new Date(rawTs).getTime() : 0;
            const isLive = ts > 0 && (now - ts) < FRESH_WINDOW_MS;

            newLayers[layerKey] = {
              ...curr,
              temperature: z.temperature ?? z.temp ?? curr.temperature,
              humidity: z.humidity ?? z.hum ?? curr.humidity,
              moisture: ((z.soil !== undefined && z.soil !== null) ? Number(z.soil) : curr.moisture),
              gas: z.gas ?? curr.gas,
              light: z.light ?? curr.light,
              motor: manualOverrides.current[id]?.motor || (z.motor ? String(z.motor).toUpperCase() : (curr.motor || 'OFF')),
              pumpInfo: { status: z.motor === 'ON' },
              isLive: isLive,
              timestamp: rawTs || curr.timestamp
            };
          });

          // Zone 3 (ESP32 #2)
          if (zone3Data) {
            const curr3 = newLayers.layer3;
            const ts3 = zone3Data.timestamp ? new Date(zone3Data.timestamp).getTime() : 0;
            const isLive3 = ts3 > 0 && (now - ts3) < FRESH_WINDOW_MS;

            newLayers.layer3 = {
              ...curr3,
              temperature: zone3Data.temperature ?? curr3.temperature,
              humidity: zone3Data.humidity ?? curr3.humidity,
              moisture: ((zone3Data.soil !== undefined && zone3Data.soil !== null) ? Number(zone3Data.soil) : curr3.moisture),
              gas: zone3Data.gas ?? curr3.gas,
              light: zone3Data.light ?? curr3.light,
              motor: zone3Data.motor || curr3.motor || 'OFF',
              pumpInfo: { status: zone3Data.motor === 'ON' },
              isLive: isLive3,
              timestamp: zone3Data.timestamp || curr3.timestamp
            };
          }

          setIsConnected(true);
          setLastUpdated(new Date().toLocaleTimeString());
          return newLayers;
        });

      } catch (error) {
        console.error("Error fetching farm data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const togglePump = async (layerId) => {
    const layerKey = Object.keys(layers).find(key => layers[key].id === layerId);
    if (!layerKey) return;

    const currentStatus = layers[layerKey].pumpInfo?.status;
    const newStatus = !currentStatus;

    await controlZoneManual(layerId, !newStatus);
  };

  const controlZoneManual = async (layerId, isHighMoisture) => {
    const turnOnMotor = !isHighMoisture;
    const newMotorState = turnOnMotor ? 'ON' : 'OFF';

    toast.success(`Zone ${layerId}: Motor set to ${newMotorState}`);

    const thingspeakUrl = `https://api.thingspeak.com/update?api_key=SW3VZ01ZZFG7J7TN&field${layerId}=${turnOnMotor ? 1 : 0}`;
    axios.get(thingspeakUrl).catch(() => {});

    manualOverrides.current[layerId] = {
      motor: newMotorState,
      pumpInfo: { status: turnOnMotor }
    };

    try {
      axios.post(`${API_BASE}/api/zone-control`, {
        zoneId: layerId,
        isHighMoisture: isHighMoisture,
        motor: newMotorState
      }, { timeout: 4000 }).catch(() => {});
    } catch (e) {}

    setLayers(prev => {
      const layerKey = Object.keys(prev).find(key => prev[key].id === layerId);
      if (!layerKey) return prev;

      return {
        ...prev,
        [layerKey]: {
          ...prev[layerKey],
          motor: newMotorState,
          pumpInfo: { ...prev[layerKey].pumpInfo, status: turnOnMotor }
        }
      };
    });
  };

  return (
    <FarmContext.Provider value={{ layers, history, togglePump, controlZoneManual, isConnected, isDemoMode, lastUpdated }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);
