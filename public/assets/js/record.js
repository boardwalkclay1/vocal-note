import { uid, save, load } from "./app.js";

let mediaRecorder = null;
let chunks = [];
let isRecording = false;

const recordBtn = document.getElementById("recordBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const recordStatus = document.getElementById("recordStatus");
const darkOverlay = document.getElementById("darkOverlay");

recordBtn.onclick = async () => {
  if (!isRecording) startRecording();
  else stopRecording();
};

darkModeBtn.onclick = () => {
  if (isRecording) darkOverlay.classList.add("active");
};

// Wake screen on touch/motion
["touchstart", "mousemove"].forEach(evt => {
  window.addEventListener(evt, () => {
    darkOverlay.classList.remove("active");
  });
});

if ("DeviceMotionEvent" in window) {
  window.addEventListener("devicemotion", (e) => {
    const total =
      Math.abs(e.accelerationIncludingGravity.x || 0) +
      Math.abs(e.accelerationIncludingGravity.y || 0) +
      Math.abs(e.accelerationIncludingGravity.z || 0);

    if (total > 25) darkOverlay.classList.remove("active");
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
      const url = URL.createObjectURL(blob);

      // Save audio reference
      const recordings = load("recordings", []);
      recordings.push({
        id: uid(),
        created: Date.now(),
        url
      });
      save("recordings", recordings);
    };

    mediaRecorder.start();
    isRecording = true;
    recordStatus.textContent = "Recording…";
    recordBtn.textContent = "Stop Recording";
  } catch (err) {
    recordStatus.textContent = "Mic permission denied.";
  }
}

function stopRecording() {
  mediaRecorder.stop();
  isRecording = false;
  recordStatus.textContent = "Idle";
  recordBtn.textContent = "Start Recording";
  darkOverlay.classList.remove("active");
}
