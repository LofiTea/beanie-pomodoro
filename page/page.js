document.getElementById("resume").addEventListener("click", () => {
  const startAutomatically = JSON.parse(localStorage.getItem("startAutomatically")) || true;

  if (startAutomatically) {
    window.close();
    browser.runtime.sendMessage({ action: "startTimer" });
  } else {
    window.close();
  }
});

document.getElementById("stats").addEventListener("click", () => {
  window.location.href = "../web/stats.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const completedPomodoros = localStorage.getItem("pomodorosCompletedToday") || 0;
  const remainingPomodoros = localStorage.getItem("shortRestsRemaining") || 4;
  const completedPomodorosElement = document.querySelector(".completed-pomodoros");
  const remainingPomodorosElement = document.querySelector(".remaining-pomodoros");
  const resumeButton = document.getElementById("resume1");
  const statsButton = document.getElementById("stats1");

  if (completedPomodorosElement) {
    completedPomodorosElement.textContent = completedPomodoros;
  }

  if (remainingPomodorosElement) {
    remainingPomodorosElement.textContent = remainingPomodoros;
  }

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    resumeButton.src = "../assets/icons/resume-icon-dark.jpg";
    statsButton.src = "../assets/icons/stats-icon-dark.jpg";
  }

  document.getElementById("darkModeButton").addEventListener("click", function () {
    let body = document.body;

    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      localStorage.setItem("darkMode", "enabled");
      resumeButton.src = "../assets/icons/resume-icon-dark.jpg";
      statsButton.src = "../assets/icons/stats-icon-dark.jpg";
    } else {
      localStorage.setItem("darkMode", "disabled");
      resumeButton.src = "../assets/icons/resume-icon.jpg";
      statsButton.src = "../assets/icons/stats-icon.jpg";
    }
  });
});