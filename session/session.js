browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateTimer") {
    const minutes = Math.floor(message.timeRemaining / 60);
    const seconds = message.timeRemaining % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  if (message.action === "clearTimerText") {
    document.getElementById("timer").textContent = '';
  }
});

document.getElementById("resume").addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "startTimer" });
});

document.getElementById("pause").addEventListener("click", () => {
  document.getElementById("timer").textContent = "";
 browser.runtime.sendMessage({ action: "pauseTimer" });
});

document.getElementById("reset").addEventListener("click", () => {
  document.getElementById("timer").textContent = "";
  browser.runtime.sendMessage({ action: "resetTimer" });
});

document.getElementById("options").addEventListener("click", () => {
  window.open("../web/options.html", "_blank");
});