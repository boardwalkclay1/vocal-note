// ===============================
// VOCAL NOTE — RECORDING ENGINE
// Local‑only, modular, zero waste
// ===============================

import { uid, save, load } from "./app.js";

// State
let mediaRecorder = null;
let chunks = [];
let isRecording = false;

// UI
const recordBtn = document.getElementById("recordBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const recordStatus = document.getElementById("recordStatus");
const darkOverlay = document.getElementById("darkOverlay");

// ===============================
// EVENT BINDINGS
// ===============================

recordBtn.onclick = () => {
  isRecording ? stopRecording() : startRecording();
};

darkModeBtn.onclick = () => {
  if (isRecording) enableDarkMode();
};

// Wake screen on touch/motion
["touchstart", "mousemove"].forEach(evt => {
  window.addEventListener(evt, disableDarkMode);
});

if ("DeviceMotionEvent" in window) {
  window.addEventListener("devicemotion", (e) => {
    const total =
      Math.abs(e.accelerationIncludingGravity.x || 0) +
      Math.abs(e.accelerationIncludingGravity.y || 0) +
      Math.abs(e.accelerationIncludingGravity.z || 0);

    if (total > 25) disableDarkMode();
  });
}

// ===============================
// DARK MODE
// ===============================

function enableDarkMode() {
  darkOverlay.classList.add("active");
}

function disableDarkMode() {
  darkOverlay.classList.remove("active");
}

// ===============================
// RECORDING LOGIC
// ===============================

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = handleRecordingStop;

    mediaRecorder.start();
    isRecording = true;

    recordStatus.textContent = "Recording…";
    recordBtn.textContent = "Stop Recording";

  } catch (err) {
    recordStatus.textContent = "Microphone permission denied.";
  }
}

function stopRecording() {
  if (!mediaRecorder) return;

  mediaRecorder.stop();
  isRecording = false;

  recordStatus.textContent = "Idle";
  recordBtn.textContent = "Start Recording";

  disableDarkMode();
}

// ===============================
// HANDLE RECORDING STOP
// ===============================

async function handleRecordingStop() {
  const blob = new Blob(chunks, { type: "audio/webm" });
  const url = URL.createObjectURL(blob);

  saveRecording(blob, url);
  createNoteFromRecording(url);
}

// ===============================
// SAVE RECORDING LOCALLY
// ===============================

function saveRecording(blob, url) {
  const recordings = load("recordings", []);

  recordings.push({
    id: uid(),
    created: Date.now(),
    url,
    blobType: "audio/webm"
  });

  save("recordings", recordings);
}

// ===============================
// CREATE NOTE FROM RECORDING
// ===============================

function createNoteFromRecording(url) {
  const notes = load("notes", []);

  const id = uid();
  const timestamp = new Date().toLocaleString();

  notes.push({
    id,
    title: "Recorded Lecture",
    content:
      `Audio recorded on ${timestamp}\n\n` +
      `Audio URL:\n${url}\n\n` +
      `Transcription: (not generated yet)`,
    preview: "Recorded lecture audio",
    updated: Date.now()
  });

  save("notes", notes);
}
