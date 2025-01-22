document.getElementById("resume").addEventListener("click", () => {
  chrome.storage.local.get(["startAutomatically"], (result) => {
    const startAutomatically = result.startAutomatically || false;

    if (startAutomatically) {
      window.close();
      chrome.runtime.sendMessage({ action: "startTimer" });
    } else {
      window.close();
    }
  });
});

document.getElementById("stats").addEventListener("click", () => {
  window.location.href = "../web/stats.html";
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(
    ["pomodorosCompletedToday", "shortRestsRemaining", "darkMode"],
    (result) => {
      const completedPomodoros = result.pomodorosCompletedToday || 0;
      const remainingPomodoros = result.shortRestsRemaining || 0;
      const completedPomodorosElement = document.querySelector(
        ".completed-pomodoros"
      );
      const remainingPomodorosElement = document.querySelector(
        ".remaining-pomodoros"
      );
      const resumeButton = document.getElementById("resume1");
      const statsButton = document.getElementById("stats1");

      if (completedPomodorosElement) {
        completedPomodorosElement.textContent = completedPomodoros;
      }

      if (remainingPomodorosElement) {
        remainingPomodorosElement.textContent = remainingPomodoros;
      }

      if (result.darkMode === "enabled") {
        document.body.classList.add("dark");
        resumeButton.src = "../assets/icons/resume-icon-dark.jpg";
        statsButton.src = "../assets/icons/stats-icon-dark.jpg";
      }
    }
  );
});