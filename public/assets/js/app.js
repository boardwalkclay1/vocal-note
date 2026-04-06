let mediaRecorder = null;
let chunks = [];
let isRecording = false;

const statusEl = document.getElementById("status");
const recordBtn = document.getElementById("recordBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const darkOverlay = document.getElementById("darkOverlay");
const notesArea = document.getElementById("notesArea");

recordBtn.addEventListener("click", async () => {
  if (!isRecording) {
    await startRecording();
  } else {
    stopRecording();
  }
});

darkModeBtn.addEventListener("click", () => {
  if (!isRecording) return; // only when recording
  toggleDarkOverlay(true);
});

function toggleDarkOverlay(on) {
  if (on) {
    darkOverlay.classList.add("active");
  } else {
    darkOverlay.classList.remove("active");
  }
}

// Wake screen when phone is picked up / touched
["touchstart", "mousemove"].forEach(evt => {
  window.addEventListener(evt, () => {
    if (darkOverlay.classList.contains("active")) {
      toggleDarkOverlay(false);
    }
  });
});

if ("DeviceMotionEvent" in window) {
  window.addEventListener("devicemotion", (e) => {
    const total =
      Math.abs(e.accelerationIncludingGravity.x || 0) +
      Math.abs(e.accelerationIncludingGravity.y || 0) +
      Math.abs(e.accelerationIncludingGravity.z || 0);
    if (total > 25 && darkOverlay.classList.contains("active")) {
      toggleDarkOverlay(false);
    }
  });
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      // TODO: send blob to backend / AI transcription
      // For now, just append a placeholder line:
      notesArea.value += "\n[Audio recorded: " + new Date().toLocaleTimeString() + "]";
    };

    mediaRecorder.start();
    isRecording = true;
    statusEl.textContent = "Recording…";
    recordBtn.textContent = "Stop recording";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Microphone permission denied.";
  }
}

function stopRecording() {
  if (!mediaRecorder) return;
  mediaRecorder.stop();
  isRecording = false;
  statusEl.textContent = "Idle";
  recordBtn.textContent = "Start recording";
  toggleDarkOverlay(false);
}

// PWA: register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(console.error);
  });
}
