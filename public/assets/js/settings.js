import { save, load } from "./app.js";

const themeButtons = document.querySelectorAll(".settings-section button");

themeButtons.forEach(btn => {
  btn.onclick = () => {
    const theme = btn.textContent.trim();
    save("theme", theme);
    alert(`Theme set to ${theme}`);
  };
});
