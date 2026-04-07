// ===============================
// VOCAL NOTE — GLOBAL ENGINE
// Local-only utilities
// ===============================

// Save JSON to localStorage
export const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Load JSON from localStorage
export const load = (key, fallback = []) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

// Unique ID
export const uid = () => "id-" + Math.random().toString(36).slice(2);

// Format date
export const formatDate = (ts) => {
  return new Date(ts).toLocaleString();
};
