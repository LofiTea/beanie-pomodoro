document.addEventListener("DOMContentLoaded", function () {
  const workTimeInput = document.getElementById("work-time");
  const shortRestTimeInput = document.getElementById("short-rest-time");
  const longRestTimeInput = document.getElementById("long-rest-time");
  const sessionCountSelect = document.getElementById("session-count");
  const notificationSoundCheckbox = document.getElementById("notification-sound-checkbox");

  function loadSettings() {
    workTimeInput.value = localStorage.getItem("workTime") || 25;
    shortRestTimeInput.value = localStorage.getItem("shortRestTime") || 5;
    longRestTimeInput.value = localStorage.getItem("longRestTime") || 15;
    sessionCountSelect.value = localStorage.getItem("sessionCount") || 4;
    notificationSoundCheckbox.checked = JSON.parse(localStorage.getItem("notificationSound")) || false;
  }

  function saveSettings() {
    localStorage.setItem("workTime", workTimeInput.value);
    localStorage.setItem("shortRestTime", shortRestTimeInput.value);
    localStorage.setItem("longRestTime", longRestTimeInput.value);
    localStorage.setItem("sessionCount", sessionCountSelect.value);
    localStorage.setItem("notificationSound", notificationSoundCheckbox.checked);
  }

  function resetSettings() {
    localStorage.setItem("workTime", 25);
    localStorage.setItem("shortRestTime", 5);
    localStorage.setItem("longRestTime", 15);
    localStorage.setItem("sessionCount", 4);
    localStorage.setItem("notificationSound", false);
    loadSettings();
  }

  loadSettings();

  document.getElementById("options-form").addEventListener("submit", function (event) {
    event.preventDefault();
    saveSettings();
    alert("Settings saved!");
  });

  document.getElementById("reset-options").addEventListener("click", function (event) {
    event.preventDefault();
    resetSettings();
    alert("Settings reset to default values!");
  });
});