import { save, load, uid } from "./app.js";

const coursesContainer = document.getElementById("coursesContainer");
const newCourseBtn = document.getElementById("newCourseBtn");

let courses = load("courses", []);

function renderCourses() {
  coursesContainer.innerHTML = "";

  if (courses.length === 0) {
    coursesContainer.innerHTML = `<p class="muted">No courses yet.</p>`;
    return;
  }

  courses.forEach(course => {
    const div = document.createElement("div");
    div.className = "course-card";
    div.innerHTML = `
      <h3>${course.name}</h3>
      <small>${course.code}</small>
    `;
    coursesContainer.appendChild(div);
  });
}

newCourseBtn.onclick = () => {
  const name = prompt("Course name:");
  if (!name) return;

  const code = prompt("Course code:");
  const course = { id: uid(), name, code };
  courses.push(course);
  save("courses", courses);
  renderCourses();
};

renderCourses();
