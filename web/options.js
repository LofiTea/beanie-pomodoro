document.addEventListener("DOMContentLoaded", function () {
  const workTimeInput = document.getElementById("work-time");
  const shortRestTimeInput = document.getElementById("short-rest-time");
  const longRestTimeInput = document.getElementById("long-rest-time");
  const sessionCountSelect = document.getElementById("session-count");
  const notificationSoundCheckbox = document.getElementById("notification-sound-checkbox");
  const toolbarBadgeCheckbox = document.getElementById("toolbar-badge-checkbox");
  const startAutomaticallyCheckbox = document.getElementById("start-automatically-checkbox");

  function loadSettings() {
    workTimeInput.value = localStorage.getItem("workTime") || 25;
    shortRestTimeInput.value = localStorage.getItem("shortRestTime") || 5;
    longRestTimeInput.value = localStorage.getItem("longRestTime") || 15;
    sessionCountSelect.value = localStorage.getItem("sessionCount") || 4;
    notificationSoundCheckbox.checked = JSON.parse(localStorage.getItem("notificationSound")) || false;
    toolbarBadgeCheckbox.checked = JSON.parse(localStorage.getItem("toolbarBadge")) || true;
    startAutomaticallyCheckbox.checked = JSON.parse(localStorage.getItem("startAutomatically")) || false;
  }

  function saveSettings() {
    localStorage.setItem("workTime", workTimeInput.value);
    localStorage.setItem("shortRestTime", shortRestTimeInput.value);
    localStorage.setItem("longRestTime", longRestTimeInput.value);
    localStorage.setItem("sessionCount", sessionCountSelect.value);
    localStorage.setItem("notificationSound", notificationSoundCheckbox.checked);
    localStorage.setItem("toolbarBadge", toolbarBadgeCheckbox.checked);
    localStorage.setItem("startAutomatically", toolbarBadgeCheckbox.checked);
  }

  function resetSettings() {
    localStorage.setItem("workTime", 25);
    localStorage.setItem("shortRestTime", 5);
    localStorage.setItem("longRestTime", 15);
    localStorage.setItem("sessionCount", 4);
    localStorage.setItem("notificationSound", false);
    localStorage.setItem("toolbarBadge", true);
    localStorage.setItem("startAutomatically", false);
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