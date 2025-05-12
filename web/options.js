document.addEventListener("DOMContentLoaded", function () {
  const workTimeInput = document.getElementById("work-time");
  const shortRestTimeInput = document.getElementById("short-rest-time");
  const longRestTimeInput = document.getElementById("long-rest-time");
  const sessionCountSelect = document.getElementById("session-count");
  const notificationSoundCheckbox = document.getElementById(
    "notification-sound-checkbox"
  );
  const startAutomaticallyCheckbox = document.getElementById(
    "start-automatically-checkbox"
  );

  function loadSettings() {
    chrome.storage.local.get(
      [
        "workTime",
        "shortRestTime",
        "longRestTime",
        "sessionCount",
        "notificationSound",
        "startAutomatically",
      ],
      (result) => {
        workTimeInput.value = result.workTime || 25;
        shortRestTimeInput.value = result.shortRestTime || 5;
        longRestTimeInput.value = result.longRestTime || 15;
        sessionCountSelect.value = result.sessionCount || 4;
        notificationSoundCheckbox.checked = result.notificationSound || false;
        startAutomaticallyCheckbox.checked = result.startAutomatically || true;
      }
    );
  }

  function saveSettings() {
    chrome.storage.local.set(
      {
        workTime: workTimeInput.value,
        shortRestTime: shortRestTimeInput.value,
        longRestTime: longRestTimeInput.value,
        sessionCount: sessionCountSelect.value,
        notificationSound: notificationSoundCheckbox.checked,
        startAutomatically: startAutomaticallyCheckbox.checked,
      },
      () => {
        chrome.runtime.sendMessage({ action: "reloadSettings" });
      }
    );
  }

  function resetSettings() {
  chrome.storage.local.set(
    {
      workTime: 25,
      shortRestTime: 5,
      longRestTime: 15,
      sessionCount: 4,
      notificationSound: false,
      startAutomatically: true,
    },
    () => {
      loadSettings();
      chrome.runtime.sendMessage({ action: "reloadSettings" });
    }
  );
}

  loadSettings();

  document
    .getElementById("new-options")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      saveSettings();
      chrome.browserAction.setPopup({ popup: "../session/session-work.html" });
      chrome.browserAction.setBadgeText({ text: "" });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#be003f" });
      chrome.runtime.sendMessage({ action: "setToWorkSession" });
      alert("Settings saved!");
    });

  document
    .getElementById("reset-options")
    .addEventListener("click", function (event) {
      event.preventDefault();
      resetSettings();
      alert("Settings reset to default values!");
    });

  chrome.storage.local.get(["darkMode"], (result) => {
    if (result.darkMode === "enabled") {
      document.body.classList.add("dark");
      document.getElementById("navbar").classList.add("navbar-dark");
      document.getElementById("navbar").classList.add("bg-dark");
      document.getElementById("navbar").classList.remove("navbar-light");
      document.getElementById("navbar").classList.remove("bg-light");
    }
  });

  document
    .getElementById("darkModeButton")
    .addEventListener("click", function () {
      let body = document.body;
      let navbar = document.getElementById("navbar");

      body.classList.toggle("dark");
      navbar.classList.toggle("navbar-light");
      navbar.classList.toggle("bg-light");
      navbar.classList.toggle("navbar-dark");
      navbar.classList.toggle("bg-dark");

      if (body.classList.contains("dark")) {
        chrome.storage.local.set({ darkMode: "enabled" });
      } else {
        chrome.storage.local.set({ darkMode: "disabled" });
      }
    });
});