import { load, save } from "./app.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let notes = load("notes", []);
let note = notes.find(n => n.id === id);

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const saveBtn = document.getElementById("saveNoteBtn");

if (!note) {
  alert("Note not found");
  window.location.href = "notes.html";
}

noteTitle.textContent = note.title;
noteContent.value = note.content;

saveBtn.onclick = () => {
  note.content = noteContent.value;
  note.preview = noteContent.value.slice(0, 120);
  note.updated = Date.now();

  save("notes", notes);
  window.location.href = "notes.html";
};
