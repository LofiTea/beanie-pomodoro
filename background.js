// Work and rest times
let workTime;
let shortRestTime;
let longRestTime;

// Statistic variables
let currentSession = "work";
let sessionCount = 0;
let shortRestsCompleted = 0;
let currentWorkStreak = 0;
let pomodorosCompletedToday = 0;

// Saved daily statistics
let workSessionsCompleted = 0;
let shortRestsRemaining = parseInt(localStorage.getItem("sessionCount"), 10);
if (isNaN(shortRestsRemaining)) {
  shortRestsRemaining = 4;
}
let longRestsCompleted = 0;
let pomodorosCompleted = 0;
let totalWorkTime = 0;
let totalBreakTime = 0;
let longestWorkStreak = 0;

// Settings variables
let timer;
let timeRemaining;
let notificationSoundEnabled;

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.workTime) {
      workTime = changes.workTime.newValue * 60;
    }
    if (changes.shortRestTime) {
      shortRestTime = changes.shortRestTime.newValue * 60;
    }
    if (changes.longRestTime) {
      longRestTime = changes.longRestTime.newValue * 60;
    }
    if (changes.notificationSound) {
      notificationSoundEnabled = changes.notificationSound.newValue;
    }
  }
});

// Function that loads in the settings
function loadSettings() {
  const today = getTodayDateString();
  chrome.storage.local.get(["lastSavedDate"], (result) => {
    const lastSavedDate = result.lastSavedDate;

    if (lastSavedDate !== today) {
      resetDailyStats();
      chrome.storage.local.set({ lastSavedDate: today });
    }

    chrome.storage.local.get(
      [
        "workTime",
        "shortRestTime",
        "longRestTime",
        "notificationSound",
        "totalWorkTime",
        "totalBreakTime",
        "longestWorkStreak",
        "pomodorosCompletedToday"
      ],
      (result) => {
        workTime = (result.workTime || 25) * 60;
        shortRestTime = (result.shortRestTime || 5) * 60;
        longRestTime = (result.longRestTime || 15) * 60;
        notificationSoundEnabled = result.notificationSound || false;
        sessionCount = 0;
        timeRemaining = workTime;

        totalWorkTime = result.totalWorkTime || 0;
        totalBreakTime = result.totalBreakTime || 0;
        longestWorkStreak = result.longestWorkStreak || 0;
        pomodorosCompletedToday = result.pomodorosCompletedToday || 0;

      }
    );
  });
}

// Function to set the daily statistics
function resetDailyStats() {
  workSessionsCompleted = 0;
  shortRestsCompleted = 0;
  longRestsCompleted = 0;
  pomodorosCompletedToday = 0;
  currentWorkStreak = 0;
  chrome.storage.local.set({
    workSessionsCompleted,
    shortRestsCompleted,
    longRestsCompleted,
    pomodorosCompletedToday,
    currentWorkStreak,
  });
}

// Function that starts the timer
function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      timeRemaining--;
      updateBadgeText(timeRemaining);
      chrome.runtime.sendMessage({
        action: "updateTimer",
        timeRemaining: timeRemaining,
      });

      if (timeRemaining < 0) {
        chrome.action.setBadgeText({ text: "" });
        clearInterval(timer);
        timer = null;
        chrome.runtime.sendMessage({ action: "clearTimerText" });
        if (notificationSoundEnabled) {
          playNotificationSound();
        }
        sessionCompleted();
      }
    }, 1000);
  }
}

// Function that marks how many sessions have been completed
function sessionCompleted() {
  if (currentSession === "work") {
    sessionCount++;
    workSessionsCompleted++;
    shortRestsRemaining--;
    totalWorkTime += workTime;
    currentWorkStreak++;

    if (sessionCount === 0 || shortRestsRemaining === 0) {
      switchPopup("../session/session-rest.html");
      openNewTab("../page/page-long-rest.html");
      currentSession = "longBreak";
      timeRemaining = longRestTime;
      shortRestsRemaining = 4;
      longRestsCompleted++;
    } else {
      switchPopup("../session/session-rest.html");
      openNewTab("../page/page-short-rest.html");
      currentSession = "shortBreak";
      timeRemaining = shortRestTime;
      shortRestsCompleted++;
    }

    if (currentWorkStreak > longestWorkStreak) {
      longestWorkStreak = currentWorkStreak;
    }

    chrome.storage.local.set({
      workSessionsCompleted,
      totalWorkTime,
      longestWorkStreak,
    });
  } else {
    pomodorosCompletedToday++;

    if (currentSession === "shortBreak") {
      totalBreakTime += shortRestTime;
      openNewTab("../page/page-work.html");
    } else if (currentSession === "longBreak") {
      totalBreakTime += longRestTime;
      openNewTab("../page/page-work-long-rest.html");
    }

    switchPopup("../session/session-work.html");
    currentSession = "work";
    timeRemaining = workTime;

    chrome.storage.local.set({
      totalBreakTime,
      shortRestsRemaining,
      longRestsRemaining,
      pomodorosCompletedToday,
    });
  }
  saveDailyStats();
}

// Function to reset the timer
function resetTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  if (currentSession === "work") {
    timeRemaining = workTime;
  } else if (currentSession === "shortBreak") {
    timeRemaining = shortRestTime;
  } else if (currentSession === "longBreak") {
    timeRemaining = longRestTime;
  }

  chrome.action.setBadgeText({ text: "" });
}

// Function to stop the timer
function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  updateBadgeText(timeRemaining);
  chrome.runtime.sendMessage({
    action: "updateTimer",
    timeRemaining: timeRemaining,
  });
}

// Function to get the daily date
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Function to switch popups
function switchPopup(popupPage) {
  chrome.action.setPopup({ popup: popupPage });
}

// Function to open a new tab
function openNewTab(page) {
  chrome.tabs.create({ url: page });
}

// Function to play the custom alarm noise
function playNotificationSound() {
  const audio = new Audio("../assets/sounds/portal.mp3");
  audio.play();
}

// Function to update the badge text
function updateBadgeText(timeRemaining) {
  const minutes = Math.floor(timeRemaining / 60);
  const badgeText = minutes > 0 ? `${minutes}m` : `<1m`;
  chrome.action.setBadgeText({ text: badgeText });

  if (currentSession === "work") {
    chrome.action.setBadgeBackgroundColor({ color: "#be003f" });
  } else {
    chrome.action.setBadgeBackgroundColor({ color: "#25be00" });
  }
}

// Function that saves the daily statistics
function saveDailyStats() {
  const today = getTodayDateString();
  chrome.storage.local.get(["statsByDate"], (result) => {
    const statsByDate = result.statsByDate || {};

    if (!statsByDate[today]) {
      statsByDate[today] = {
        workSessionsCompleted: 0,
        shortRestsCompleted: 0,
        longRestsCompleted: 0,
        pomodorosCompletedToday: 0,
        totalWorkTime: 0,
        totalBreakTime: 0,
        longestWorkStreak: 0,
      };
    }

    statsByDate[today].workSessionsCompleted = workSessionsCompleted;
    statsByDate[today].shortRestsCompleted = shortRestsCompleted;
    statsByDate[today].longRestsCompleted = longRestsCompleted;
    statsByDate[today].pomodorosCompletedToday = pomodorosCompletedToday;
    statsByDate[today].totalWorkTime = totalWorkTime;
    statsByDate[today].totalBreakTime = totalBreakTime;
    statsByDate[today].longestWorkStreak = longestWorkStreak;

    chrome.storage.local.set({
      statsByDate,
      totalWorkTime,
      totalBreakTime,
      longestWorkStreak,
      pomodorosCompletedToday,
      lastSavedDate: today,
    });
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "startTimer") {
    startTimer();
  } else if (message.action === "pauseTimer") {
    pauseTimer();
  } else if (message.action === "resetTimer") {
    resetTimer();
  } else if (message.action === "reloadSettings") {
    loadSettings();
  } else if (message.action === "setToWorkSession") {
    workSessionsCompleted--;
    currentSession = "work";
    timeRemaining = workTime;
    chrome.browserAction.setBadgeText({ text: "" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#be003f" });
  }
});

loadSettings();