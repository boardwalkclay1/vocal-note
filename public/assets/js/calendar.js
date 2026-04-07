import { save, load } from "./app.js";

const calendarGrid = document.getElementById("calendarGrid");
const calendarMonth = document.getElementById("calendarMonth");
const eventsList = document.getElementById("eventsList");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let events = load("calendarEvents", []);
let current = new Date();

function renderCalendar() {
  const year = current.getFullYear();
  const month = current.getMonth();

  calendarMonth.textContent = current.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarGrid.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.innerHTML += `<div class="empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${month + 1}-${d}`;
    const dayEvents = events.filter(e => e.date === dateStr);

    calendarGrid.innerHTML += `
      <div class="day" data-date="${dateStr}">
        <span>${d}</span>
        ${dayEvents.length ? `<div class="dot"></div>` : ""}
      </div>
    `;
  }

  document.querySelectorAll(".day").forEach(day => {
    day.onclick = () => openDay(day.dataset.date);
  });
}

function openDay(dateStr) {
  const dayEvents = events.filter(e => e.date === dateStr);

  eventsList.innerHTML = `
    <h4>${dateStr}</h4>
    ${dayEvents.map(e => `<div class="event">${e.title}</div>`).join("")}
    <button class="primary" id="addEventBtn">Add Event</button>
  `;

  document.getElementById("addEventBtn").onclick = () => {
    const title = prompt("Event title:");
    if (!title) return;

    events.push({ date: dateStr, title });
    save("calendarEvents", events);
    openDay(dateStr);
    renderCalendar();
  };
}

prevMonth.onclick = () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
};

nextMonth.onclick = () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
