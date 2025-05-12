document.addEventListener("DOMContentLoaded", function () {
  const workTimeInput = document.getElementById("work-time");
  const shortRestTimeInput = document.getElementById("short-rest-time");
  const longRestTimeInput = document.getElementById("long-rest-time");
  const sessionCountSelect = document.getElementById("session-count");
  const notificationSoundCheckbox = document.getElementById("notification-sound-checkbox");
  const startAutomaticallyCheckbox = document.getElementById("start-automatically-checkbox");

  function loadSettings() {
    workTimeInput.value = localStorage.getItem("workTime") || 25;
    shortRestTimeInput.value = localStorage.getItem("shortRestTime") || 5;
    longRestTimeInput.value = localStorage.getItem("longRestTime") || 15;
    sessionCountSelect.value = localStorage.getItem("sessionCount") || 4;
    notificationSoundCheckbox.checked = JSON.parse(localStorage.getItem("notificationSound")) || false;
    startAutomaticallyCheckbox.checked = JSON.parse(localStorage.getItem("startAutomatically")) || true;
  }

  function saveSettings() {
    localStorage.setItem("workTime", workTimeInput.value);
    localStorage.setItem("shortRestTime", shortRestTimeInput.value);
    localStorage.setItem("longRestTime", longRestTimeInput.value);
    localStorage.setItem("sessionCount", sessionCountSelect.value);
    localStorage.setItem("notificationSound", notificationSoundCheckbox.checked);
    localStorage.setItem("startAutomatically", startAutomaticallyCheckbox.checked);
  }

  function resetSettings() {
    localStorage.setItem("workTime", 25);
    localStorage.setItem("shortRestTime", 5);
    localStorage.setItem("longRestTime", 15);
    localStorage.setItem("sessionCount", 4);
    localStorage.setItem("notificationSound", false);
    localStorage.setItem("startAutomatically", true);
    loadSettings();
  }

  loadSettings();

  document.getElementById("new-settings").addEventListener("click", function (event) {
    event.preventDefault();
    saveSettings();
    browser.browserAction.setPopup({ popup: "../session/session-work.html" });
    browser.browserAction.setBadgeText({ text: "" });
    browser.browserAction.setBadgeBackgroundColor({ color: "#be003f" });
    browser.runtime.sendMessage({ action: "setToWorkSession" });
    alert("Settings saved!");
  });

  document.getElementById("reset-options").addEventListener("click", function (event) {
    event.preventDefault();
    resetSettings();
    alert("Settings reset to default values!");
  });

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    document.getElementById("navbar").classList.add("navbar-dark");
    document.getElementById("navbar").classList.add("bg-dark");
    document.getElementById("navbar").classList.remove("navbar-light");
    document.getElementById("navbar").classList.remove("bg-light");
  }

  document.getElementById("darkModeButton").addEventListener("click", function () {
      let body = document.body;
      let navbar = document.getElementById("navbar");

      body.classList.toggle("dark");
      navbar.classList.toggle("navbar-light");
      navbar.classList.toggle("bg-light");
      navbar.classList.toggle("navbar-dark");
      navbar.classList.toggle("bg-dark");
     
      if (body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "enabled");
      } else {
        localStorage.setItem("darkMode", "disabled");
      }
    });
});