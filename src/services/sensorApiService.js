// API Service for Sensor Data
const RAW_URL = import.meta.env?.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com';
const API_BASE_URL = RAW_URL.replace(/\/api\/?$/, '');
const ZONE3_BASE_URL = API_BASE_URL + '/api/zone3'; // Dedicated Zone 3 (2nd ESP32)

/**
 * Fetch daily sensor data for a specific zone.
 * Zone 3 is routed to the dedicated /api/zone3/daily endpoint (2nd ESP32).
 * @param {string} zone - zone1, zone2, or zone3
 * @param {string} date - YYYY-MM-DD (optional, defaults to today)
 */
export const fetchDailyData = async (zone, date) => {
  zone = zone || 'zone1';
  const dateParam = date || new Date().toISOString().split('T')[0];

  if (zone === 'zone3') {
    const url = ZONE3_BASE_URL + '/daily?date=' + dateParam;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch Zone 3 daily data: ' + response.statusText);
      return response.json();
    } catch (error) {
      console.error('Error fetching Zone 3 daily data:', error);
      throw error;
    }
  }

  const url = API_BASE_URL + '/api/sensor/daily/' + zone + '?date=' + dateParam;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch daily data: ' + response.statusText);
    return response.json();
  } catch (error) {
    console.error('Error fetching daily data:', error);
    throw error;
  }
};

/**
 * Fetch daily sensor data for all zones
 * @param {string} date - YYYY-MM-DD (optional, defaults to today)
 */
export const fetchAllZonesDaily = async (date) => {
  const dateParam = date || new Date().toISOString().split('T')[0];
  const url = API_BASE_URL + '/api/sensor/daily?date=' + dateParam;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch all zones daily data: ' + response.statusText);
    return response.json();
  } catch (error) {
    console.error('Error fetching all zones daily data:', error);
    throw error;
  }
};

/**
 * Fetch monthly sensor data for a specific zone.
 * Zone 3 is routed to the dedicated /api/zone3/monthly endpoint (2nd ESP32).
 * @param {string} zone - zone1, zone2, or zone3
 * @param {number} year  - optional, defaults to current year
 * @param {number} month - optional, defaults to current month
 */
export const fetchMonthlyData = async (zone, year, month) => {
  zone = zone || 'zone1';
  const now = new Date();
  const yearParam  = year  || now.getFullYear();
  const monthParam = month || (now.getMonth() + 1);

  if (zone === 'zone3') {
    const url = ZONE3_BASE_URL + '/monthly?year=' + yearParam + '&month=' + monthParam;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch Zone 3 monthly data: ' + response.statusText);
      return response.json();
    } catch (error) {
      console.error('Error fetching Zone 3 monthly data:', error);
      throw error;
    }
  }

  const url = API_BASE_URL + '/api/sensor/monthly/' + zone + '?year=' + yearParam + '&month=' + monthParam;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch monthly data: ' + response.statusText);
    return response.json();
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    throw error;
  }
};

/**
 * Fetch monthly sensor data for all zones
 * @param {number} year  - optional, defaults to current year
 * @param {number} month - optional, defaults to current month
 */
export const fetchAllZonesMonthly = async (year, month) => {
  const now = new Date();
  const yearParam  = year  || now.getFullYear();
  const monthParam = month || (now.getMonth() + 1);
  const url = API_BASE_URL + '/api/sensor/monthly?year=' + yearParam + '&month=' + monthParam;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch all zones monthly data: ' + response.statusText);
    return response.json();
  } catch (error) {
    console.error('Error fetching all zones monthly data:', error);
    throw error;
  }
};
