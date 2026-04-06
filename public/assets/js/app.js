// ===============================
// VOCAL NOTE — GLOBAL APP ENGINE
// ===============================

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(console.error);
  });
}

// Local storage helpers
export const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const load = (key, fallback = null) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

// Generate unique IDs
export const uid = () => "id-" + Math.random().toString(36).substr(2, 9);

// Format dates
export const formatDate = (date) => {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};
