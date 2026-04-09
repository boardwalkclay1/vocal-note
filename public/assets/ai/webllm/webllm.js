import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

let llm = null;

export async function loadLLM() {
  if (llm) return llm;

  llm = await CreateMLCEngine("Llama-3-8B-Instruct-q4f32_1", {
    modelUrl: "/assets/ai/webllm/model.json"
  });

  return llm;
}

async function run(prompt) {
  const engine = await loadLLM();

  const result = await engine.chat.completions.create({
    messages: [{ role: "user", content: prompt }]
  });

  return result.choices[0].message.content;
}

export async function summarize(text) {
  return run(`
Summarize the following lecture notes into:
- Key points
- Definitions
- Important terms
- Exam-relevant concepts

Lecture:
${text}
`);
}

export async function flashcards(text) {
  return run(`
Turn the following lecture notes into flashcards.
Format each card as:
Q: ...
A: ...

Notes:
${text}
`);
}

export async function quiz(text) {
  return run(`
Generate 5 quiz questions from the following notes.
Use multiple choice format.

Notes:
${text}
`);
}

export async function conceptMap(text) {
  return run(`
Extract the 12 most important concepts from the following notes.
Return them as a simple list.

Notes:
${text}
`);
}
