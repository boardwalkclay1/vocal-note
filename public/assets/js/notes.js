import { save, load, uid, formatDate } from "./app.js";

const notesContainer = document.getElementById("notesContainer");
const newNoteBtn = document.getElementById("newNoteBtn");

let notes = load("notes", []);

function renderNotes() {
  notesContainer.innerHTML = "";

  if (notes.length === 0) {
    notesContainer.innerHTML = `<p class="muted">No notes yet.</p>`;
    return;
  }

  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note-card";
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.preview}</p>
      <small>${formatDate(note.updated)}</small>
    `;
    div.onclick = () => openNote(note.id);
    notesContainer.appendChild(div);
  });
}

function openNote(id) {
  window.location.href = `note-editor.html?id=${id}`;
}

newNoteBtn.onclick = () => {
  const id = uid();
  const newNote = {
    id,
    title: "Untitled Note",
    content: "",
    preview: "",
    updated: Date.now()
  };
  notes.push(newNote);
  save("notes", notes);
  openNote(id);
};

renderNotes();
