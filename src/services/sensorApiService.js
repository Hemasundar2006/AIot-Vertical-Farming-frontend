// API Service for Sensor Data
const API_BASE_URL = 'https://aiot-vertical-farming-backend.onrender.com';

/**
 * Fetch daily sensor data for a specific zone
 * @param {string} zone - Zone identifier (zone1, zone2, or zone3)
 * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<Object>} Daily sensor data response
 */
export const fetchDailyData = async (zone = 'zone1', date = null) => {
  const dateParam = date || new Date().toISOString().split('T')[0];
  const url = `${API_BASE_URL}/api/sensor/daily/${zone}?date=${dateParam}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch daily data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching daily data:', error);
    throw error;
  }
};

/**
 * Fetch daily sensor data for all zones
 * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<Object>} All zones daily data response
 */
export const fetchAllZonesDaily = async (date = null) => {
  const dateParam = date || new Date().toISOString().split('T')[0];
  const url = `${API_BASE_URL}/api/sensor/daily?date=${dateParam}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch all zones daily data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all zones daily data:', error);
    throw error;
  }
};

/**
 * Fetch monthly sensor data for a specific zone
 * @param {string} zone - Zone identifier (zone1, zone2, or zone3)
 * @param {number} year - Year (2000-2100, optional, defaults to current year)
 * @param {number} month - Month (1-12, optional, defaults to current month)
 * @returns {Promise<Object>} Monthly sensor data response
 */
export const fetchMonthlyData = async (zone = 'zone1', year = null, month = null) => {
  const now = new Date();
  const yearParam = year || now.getFullYear();
  const monthParam = month || now.getMonth() + 1;
  const url = `${API_BASE_URL}/api/sensor/monthly/${zone}?year=${yearParam}&month=${monthParam}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch monthly data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    throw error;
  }
};

/**
 * Fetch monthly sensor data for all zones
 * @param {number} year - Year (2000-2100, optional, defaults to current year)
 * @param {number} month - Month (1-12, optional, defaults to current month)
 * @returns {Promise<Object>} All zones monthly data response
 */
export const fetchAllZonesMonthly = async (year = null, month = null) => {
  const now = new Date();
  const yearParam = year || now.getFullYear();
  const monthParam = month || now.getMonth() + 1;
  const url = `${API_BASE_URL}/api/sensor/monthly?year=${yearParam}&month=${monthParam}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch all zones monthly data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all zones monthly data:', error);
    throw error;
  }
};

