import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

const FarmContext = createContext();

const RAW_BASE = import.meta.env?.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com';
const API_BASE = RAW_BASE.replace(/\/api\/?$/, '');
const SOCKET_URL = API_BASE;
// ESP32 #1 API: strictly Zones 1 & 2
const DATA_API_URL = `${API_BASE}/get_temperature`;
// ESP32 #2 API: dedicated separate route for Zone 3 ONLY
const ZONE3_API_URL = `${API_BASE}/api/zone3/latest`;

const THRESHOLDS = {
  temperature: 30,
  humidity: 80,
  moistureLow: 20,
  gasHigh: 2000,
};

export const FarmProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [layers, setLayers] = useState({
    layer1: { id: 1, name: 'Black Soil', temperature: 0, humidity: 0, moisture: 0, gas: 0, light: 0, motor: 'OFF', pumpInfo: { status: false }, isLive: false, timestamp: null },
    layer2: { id: 2, name: 'Red Soil', temperature: 0, humidity: 0, moisture: 0, gas: 0, light: 0, motor: 'OFF', pumpInfo: { status: false }, isLive: false, timestamp: null },
    layer3: { id: 3, name: 'Sand (Zone 3)', temperature: 0, humidity: 0, moisture: 0, gas: 0, light: 0, motor: 'OFF', pumpInfo: { status: false }, isLive: false, timestamp: null }
  });
  const [lastUpdated, setLastUpdated] = useState('');
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const manualOverrides = useRef({});
  const prevLayerState = useRef(layers);

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
        const FRESH_THRESHOLD_MS = 90000;

        // 1. Fetch Zones 1 & 2 from /get_temperature (ESP32 #1)
        let zones1and2 = [];
        try {
          const res = await axios.get(DATA_API_URL, { timeout: 4000 });
          if (res.data?.zones && Array.isArray(res.data.zones)) {
            zones1and2 = res.data.zones;
          }
        } catch (err) {}

        // 2. Fetch Zone 3 from dedicated separate route /api/zone3/latest (ESP32 #2)
        let zone3Data = null;
        try {
          const z3Res = await axios.get(ZONE3_API_URL, { timeout: 4000 });
          if (z3Res.data?.data) {
            zone3Data = z3Res.data.data;
          }
        } catch (err) {}

        setLayers(prev => {
          const newLayers = { ...prev };
          let hasChanges = false;

          // Update Zones 1 & 2
          zones1and2.forEach(z => {
            const id = Number(z.id || z.zoneId);
            const layerKey = id === 1 ? 'layer1' : id === 2 ? 'layer2' : null;
            if (!layerKey || !newLayers[layerKey]) return;

            const curr = newLayers[layerKey];
            const ts = z.timestamp ? new Date(z.timestamp).getTime() : 0;
            const isLive = ts > 0 && (now - ts) < FRESH_THRESHOLD_MS;

            newLayers[layerKey] = {
              ...curr,
              // If live: show live values. If offline: 0
              temperature: isLive ? (z.temperature ?? z.temp ?? 0) : 0,
              humidity: isLive ? (z.humidity ?? z.hum ?? 0) : 0,
              moisture: isLive ? (z.soil ?? 0) : 0,
              gas: isLive ? (z.gas ?? 0) : 0,
              light: isLive ? (z.light ?? 0) : 0,
              motor: isLive ? (z.motor || 'OFF') : 'OFF',
              pumpInfo: { status: isLive && z.motor === 'ON' },
              isLive: isLive,
              timestamp: z.timestamp
            };
            hasChanges = true;
          });

          // Update Zone 3: STRICTLY only show values if live payload received within 90s!
          if (zone3Data) {
            const curr3 = newLayers.layer3;
            const ts3 = zone3Data.timestamp ? new Date(zone3Data.timestamp).getTime() : 0;
            const isLive3 = ts3 > 0 && (now - ts3) < FRESH_THRESHOLD_MS;

            newLayers.layer3 = {
              ...curr3,
              temperature: isLive3 ? (zone3Data.temperature ?? 0) : 0,
              humidity: isLive3 ? (zone3Data.humidity ?? 0) : 0,
              moisture: isLive3 ? (zone3Data.soil ?? 0) : 0,
              gas: isLive3 ? (zone3Data.gas ?? 0) : 0,
              light: isLive3 ? (zone3Data.light ?? 0) : 0,
              motor: isLive3 ? (zone3Data.motor || 'OFF') : 'OFF',
              pumpInfo: { status: isLive3 && zone3Data.motor === 'ON' },
              isLive: isLive3,
              timestamp: zone3Data.timestamp
            };
            hasChanges = true;
          }

          if (hasChanges) {
            setIsConnected(true);
            setLastUpdated(new Date().toLocaleTimeString());
          }
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
