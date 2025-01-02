browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateTimer") {
    const minutes = Math.floor(message.timeRemaining / 60);
    const seconds = message.timeRemaining % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
});

document.getElementById("resume").addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "startTimer" });
});

document.getElementById("reset").addEventListener("click", () => {
  document.getElementById("timer").textContent = "";
  browser.runtime.sendMessage({ action: "resetTimer" });
});

document.getElementById("options").addEventListener("click", () => {
  window.open("../web/options.html", "_blank");
});

document.getElementById("stats").addEventListener("click", () => {
  window.open("../web/stats.html", "_blank");
});