// ===============================
// VOCAL NOTE — LOCAL AI ENGINE
// Whisper.cpp (WASM) + WebLLM
// ===============================

import { transcribeAudio } from "../ai/whisper/whisper.js";
import { summarize, flashcards, quiz, conceptMap } from "../ai/webllm/webllm.js";

export const AI = {
  // ---------------------------
  // 1. TRANSCRIPTION
  // ---------------------------
  async transcribe(blob) {
    try {
      return await transcribeAudio(blob);
    } catch (err) {
      console.error("Whisper failed:", err);
      return "(Transcription unavailable)";
    }
  },

  // ---------------------------
  // 2. SUMMARIZATION
  // ---------------------------
  async summarize(text) {
    return await summarize(text);
  },

  // ---------------------------
  // 3. FLASHCARDS
  // ---------------------------
  async flashcards(text) {
    return await flashcards(text);
  },

  // ---------------------------
  // 4. QUIZ
  // ---------------------------
  async quiz(text) {
    return await quiz(text);
  },

  // ---------------------------
  // 5. CONCEPT MAP
  // ---------------------------
  async conceptMap(text) {
    return await conceptMap(text);
  },

  // ---------------------------
  // 6. STUDY SHEET
  // ---------------------------
  async studySheet(text) {
    const summary = await summarize(text);
    const cards = await flashcards(text);
    const questions = await quiz(text);
    const concepts = await conceptMap(text);

    return `
=== STUDY SHEET ===

SUMMARY:
${summary}

FLASHCARDS:
${cards}

QUIZ:
${questions}

CONCEPT MAP:
${concepts}
`;
  },

  // ---------------------------
  // 7. ASK YOUR NOTES ANYTHING
  // ---------------------------
  async ask(notes, question) {
    const combined = notes.join("\n\n");

    return await summarize(`
Using ONLY the following notes, answer the question:

NOTES:
${combined}

QUESTION:
${question}
`);
  }
};
