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

  // Keep track of manual overrides (starts empty so live API data is used by default)
  const manualOverrides = useRef({});

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
        const layer = resetState[key];
        const zoneId = layer.id;
        const override = manualOverrides.current[zoneId];

        const defaultMoisture = override?.moisture ?? layer.moisture;
        const defaultMotor = override?.motor ?? layer.motor;

        resetState[key] = {
          ...layer,
          temperature: 0,
          humidity: 0,
          gas: 0,
          light: 0,
          moisture: defaultMoisture,
          motor: defaultMotor,
          pumpInfo: { status: defaultMotor === 'ON' }
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
            const formattedTime = timestamp.toLocaleString();
            setLastUpdated(prev => (prev !== formattedTime ? formattedTime : prev));
            // Check if timestamp is fresh (within 90 seconds)
            isFresh = (new Date() - timestamp) < 90000;
          }

          setIsConnected(prev => (prev !== isFresh ? isFresh : prev));

          if (isFresh) {
            updateLayersFromApi(data);
          } else {
            resetLayersToOffline();
          }
        } else {
          setIsConnected(prev => (prev !== false ? false : prev));
          setIsDemoMode(false);
          resetLayersToOffline();
        }
      } catch (error) {
        console.error("Error fetching farm data:", error);
        setIsConnected(prev => (prev !== false ? false : prev));
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
        let hasChanges = false;

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
                const rawSoil = zone.soil !== undefined && zone.soil !== null ? Number(zone.soil) : (zone.moisture !== undefined && zone.moisture !== null ? Number(zone.moisture) : null);

                // Use manual override if user explicitly set one in Zone Control; otherwise use raw API soil value
                let currentMoisture;
                if (manualOverrides.current[zoneId]?.moisture !== undefined) {
                  currentMoisture = manualOverrides.current[zoneId].moisture;
                } else if (rawSoil !== null && !isNaN(rawSoil)) {
                  currentMoisture = rawSoil;
                } else {
                  currentMoisture = newLayers[layerKey].moisture;
                }

                let motorState = newLayers[layerKey].motor || 'OFF';

                // Threshold logic: > 70 motor is OFF, < 30 motor is ON
                if (currentMoisture > 70) {
                  motorState = 'OFF';
                } else if (currentMoisture < 30) {
                  motorState = 'ON';
                } else if (rawMotor !== undefined && rawMotor !== null) {
                  const strVal = String(rawMotor).trim().toUpperCase();
                  if (strVal === 'ON' || strVal === 'TRUE' || rawMotor === true || rawMotor === 1) {
                    motorState = 'ON';
                  } else {
                    motorState = 'OFF';
                  }
                }

                const isMotorOn = motorState === 'ON';
                const currentLayer = newLayers[layerKey];

                const updatedLayer = {
                    ...currentLayer,
                    temperature: zone.temperature !== undefined ? zone.temperature : (zone.temp !== undefined ? zone.temp : currentLayer.temperature),
                    humidity: zone.humidity !== undefined ? zone.humidity : (zone.hum !== undefined ? zone.hum : currentLayer.humidity),
                    moisture: currentMoisture,
                    gas: zone.gas !== undefined ? zone.gas : currentLayer.gas,
                    light: zone.light !== undefined ? zone.light : currentLayer.light,
                    motor: motorState,
                    pumpInfo: {
                      ...currentLayer.pumpInfo,
                      status: isMotorOn
                    }
                };

                // Apply any manual overrides if they exist for this zone
                if (manualOverrides.current[zoneId]) {
                    const override = manualOverrides.current[zoneId];
                    updatedLayer.motor = override.motor;
                    updatedLayer.moisture = override.moisture;
                    updatedLayer.pumpInfo = {
                        ...updatedLayer.pumpInfo,
                        status: override.pumpInfo.status
                    };
                }

                // Check if anything actually changed
                if (
                  currentLayer.temperature !== updatedLayer.temperature ||
                  currentLayer.humidity !== updatedLayer.humidity ||
                  currentLayer.moisture !== updatedLayer.moisture ||
                  currentLayer.gas !== updatedLayer.gas ||
                  currentLayer.light !== updatedLayer.light ||
                  currentLayer.motor !== updatedLayer.motor
                ) {
                  hasChanges = true;
                }

                newLayers[layerKey] = updatedLayer;
            }
        });

        if (!hasChanges) {
          return prev; // Return unchanged reference so React skips re-rendering!
        }

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

    await controlZoneManual(layerId, newStatus);
  };

  const controlZoneManual = async (layerId, isHighMoisture) => {
    // Clicking ON button (isHighMoisture = true): Moisture increases to > 70 -> Motor shows OFF
    // Clicking OFF button (isHighMoisture = false): Moisture decreases to < 30 -> Motor shows ON
    let newMoisture;
    let newMotorState;
    let turnOnMotor;

    if (isHighMoisture) {
      // ON button -> moisture > 70 -> motor OFF
      newMoisture = Math.floor(Math.random() * (88 - 72 + 1)) + 72; // > 70
      newMotorState = 'OFF';
      turnOnMotor = false;
    } else {
      // OFF button -> moisture < 30 -> motor ON
      newMoisture = Math.floor(Math.random() * (28 - 15 + 1)) + 15; // < 30
      newMotorState = 'ON';
      turnOnMotor = true;
    }

    toast.success(`Zone ${layerId}: Moisture set to ${newMoisture}% (${isHighMoisture ? '>70' : '<30'}). Motor ${newMotorState}`);

    // Call ThingSpeak API silently in background (no popup errors)
    const thingspeakUrl = `https://api.thingspeak.com/update?api_key=SW3VZ01ZZFG7J7TN&field${layerId}=${turnOnMotor ? 1 : 0}`;
    axios.get(thingspeakUrl).catch(e => {
        console.error("Silent ThingSpeak sync:", e?.message);
    });

    // Set local override
    manualOverrides.current[layerId] = {
      motor: newMotorState,
      moisture: newMoisture,
      pumpInfo: { status: turnOnMotor }
    };

    // Send update to Backend API so backend persists state for all devices
    try {
      axios.post('https://aiot-vertical-farming-backend.onrender.com/api/zone-control', {
        zoneId: layerId,
        isHighMoisture: isHighMoisture,
        soil: newMoisture,
        motor: newMotorState
      }, { timeout: 4000 }).catch(err => {
        console.error("Backend zone-control POST log:", err?.message);
      });
    } catch (e) {
      console.error("Zone control sync error:", e);
    }

    // Optimistically update context state locally
    setLayers(prev => {
      const layerKey = Object.keys(prev).find(key => prev[key].id === layerId);
      if (!layerKey) return prev;

      return {
        ...prev,
        [layerKey]: {
          ...prev[layerKey],
          motor: newMotorState,
          moisture: newMoisture,
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
