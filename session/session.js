chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateTimer") {
    const minutes = Math.floor(message.timeRemaining / 60);
    const seconds = message.timeRemaining % 60;
    document.getElementById("timer").textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  if (message.action === "clearTimerText") {
    document.getElementById("timer").textContent = "";
  }
});

document.getElementById("resume").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startTimer" });
});

document.getElementById("pause").addEventListener("click", () => {
  document.getElementById("timer").textContent = "";
  chrome.runtime.sendMessage({ action: "pauseTimer" });
});

document.getElementById("reset").addEventListener("click", () => {
  document.getElementById("timer").textContent = "";
  chrome.runtime.sendMessage({ action: "resetTimer" });
});

document.getElementById("options").addEventListener("click", () => {
  window.open("../web/options.html", "_blank");
});

document.addEventListener("DOMContentLoaded", () => {
  const resumeButton = document.getElementById("resume1");
  const pauseButton = document.getElementById("pause1");
  const resetButton = document.getElementById("reset1");
  const optionsButton = document.getElementById("options1");

  chrome.storage.local.get(["darkMode"], (result) => {
    if (result.darkMode === "enabled") {
      document.body.classList.add("dark");
      resumeButton.src = "../assets/icons/resume-icon-dark.jpg";
      pauseButton.src = "../assets/icons/pause-icon-dark.jpg";
      resetButton.src = "../assets/icons/reset-icon-dark.jpg";
      optionsButton.src = "../assets/icons/options-icon-dark.jpg";
    }
  });
});