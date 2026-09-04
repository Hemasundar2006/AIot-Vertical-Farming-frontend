/**
 * Zone 3 API Service
 * Handles all requests to the dedicated Zone 3 endpoints
 * (data received from the 2nd ESP32).
 */

const RAW_BASE = import.meta.env?.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com';
const API_ROOT = RAW_BASE.replace(/\/api\/?$/, '');
const BASE = `${API_ROOT}/api/zone3`;

// helper
const get = async (path) => {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error('Zone3 API error ' + res.status + ': ' + res.statusText);
  return res.json();
};

// POST /api/zone3/data - Send Zone 3 sensor payload from 2nd ESP32
// Server accepts all 3 zones but stores ONLY Zone 3
export const sendZone3Data = async (payload) => {
  const res = await fetch(BASE + '/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Zone3 POST error ' + res.status + ': ' + res.statusText);
  return res.json();
};

// GET /api/zone3/latest - Most-recent Zone 3 reading from MongoDB
export const fetchZone3Latest = async () => get('/latest');

// GET /api/zone3/all-latest - Latest reading for ALL 3 zones (live dashboard)
export const fetchAllZonesLatest = async () => get('/all-latest');

// GET /api/zone3/history?limit=N - Last N Zone 3 readings (default 50, max 500)
export const fetchZone3History = async (limit) => {
  const lim = limit || 50;
  return get('/history?limit=' + lim);
};

// GET /api/zone3/daily?date=YYYY-MM-DD - All Zone 3 readings for a specific day
export const fetchZone3Daily = async (date) => {
  const dateParam = date || new Date().toISOString().split('T')[0];
  return get('/daily?date=' + dateParam);
};

// GET /api/zone3/monthly?year=YYYY&month=MM - Per-day aggregates for a month
export const fetchZone3Monthly = async (year, month) => {
  const now = new Date();
  const y = year  || now.getFullYear();
  const m = month || (now.getMonth() + 1);
  return get('/monthly?year=' + y + '&month=' + m);
};

// GET /api/zone3/stats?from=ISO&to=ISO - Summary stats for a custom time range
export const fetchZone3Stats = async (from, to) => {
  const now = new Date();
  const fromISO = from ? new Date(from).toISOString() : new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const toISO   = to   ? new Date(to).toISOString()   : now.toISOString();
  return get('/stats?from=' + encodeURIComponent(fromISO) + '&to=' + encodeURIComponent(toISO));
};
