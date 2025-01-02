document.getElementById("resume").addEventListener("click", () => {
  const startAutomatically = JSON.parse(localStorage.getItem("startAutomatically")) || false;

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
  const completedPomodoros = localStorage.getItem("pomodorosCompleted") || 0;
  const remainingPomodoros = localStorage.getItem("shortRestsRemaining") || 0;
  const completedPomodorosElement = document.querySelector(".completed-pomodoros");
  const remainingPomodorosElement = document.querySelector(".remaining-pomodoros");

  if (completedPomodorosElement) {
    completedPomodorosElement.textContent = completedPomodoros;
  }

  if (remainingPomodorosElement) {
    remainingPomodorosElement.textContent = remainingPomodoros;
  }
});