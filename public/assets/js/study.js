import { load } from "./app.js";

const studyOutput = document.getElementById("studyOutput");

const studySheetBtn = document.getElementById("studySheetBtn");
const flashcardsBtn = document.getElementById("flashcardsBtn");
const quizBtn = document.getElementById("quizBtn");
const conceptMapBtn = document.getElementById("conceptMapBtn");

function getAllNotesText() {
  const notes = load("notes", []);
  return notes.map(n => n.content).join("\n\n");
}

studySheetBtn.onclick = () => {
  const text = getAllNotesText();
  studyOutput.innerHTML = `
    <h2>Study Sheet</h2>
    <p>${text.slice(0, 500)}...</p>
  `;
};

flashcardsBtn.onclick = () => {
  const text = getAllNotesText();
  const lines = text.split(".").filter(l => l.trim().length > 0);

  studyOutput.innerHTML = `
    <h2>Flashcards</h2>
    ${lines.map(l => `<div class="flashcard">${l.trim()}</div>`).join("")}
  `;
};

quizBtn.onclick = () => {
  const text = getAllNotesText();
  const lines = text.split(".").filter(l => l.trim().length > 0);

  studyOutput.innerHTML = `
    <h2>Quiz</h2>
    ${lines.slice(0, 5).map((l, i) => `
      <div class="quiz-question">
        <strong>Q${i + 1}:</strong> ${l.trim()}?
      </div>
    `).join("")}
  `;
};

conceptMapBtn.onclick = () => {
  const text = getAllNotesText();
  const words = text.split(/\s+/);
  const freq = {};

  words.forEach(w => {
    w = w.toLowerCase();
    if (!freq[w]) freq[w] = 0;
    freq[w]++;
  });

  const top = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  studyOutput.innerHTML = `
    <h2>Concept Map</h2>
    <div class="concept-map">
      ${top.map(([word]) => `<span>${word}</span>`).join("")}
    </div>
  `;
};
