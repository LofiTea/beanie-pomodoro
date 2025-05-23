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
let shortRestsRemaining = localStorage.getItem("sessionCount") || 4;
let longRestsCompleted = 0;
let pomodorosCompleted = 0;
let totalWorkTime = 0;
let totalBreakTime = 0;
let longestWorkStreak = 0;

// Settings variables
let timer;
let timeRemaining;
let notificationSoundEnabled;

// Function that loads in the settings
function loadSettings() {
  const today = getTodayDateString();
  const lastSavedDate = localStorage.getItem("lastSavedDate");

  if (lastSavedDate !== today) {
    resetDailyStats();
    localStorage.setItem("lastSavedDate", today);
  }
  
  workTime = JSON.parse(localStorage.getItem("workTime")) * 60 || 25 * 60;
  shortRestTime = JSON.parse(localStorage.getItem("shortRestTime")) * 60 || 5 * 60;
  longRestTime = JSON.parse(localStorage.getItem("longRestTime")) * 60 || 15 * 60;
  notificationSoundEnabled = JSON.parse(localStorage.getItem("notificationSound")) || false;
  startAutomaticallyCheckbox = JSON.parse(localStorage.getItem("startAutomatically")) || true;
  sessionCount = 0;
  timeRemaining = workTime;

  totalWorkTime = JSON.parse(localStorage.getItem("totalWorkTime")) || 0;
  totalBreakTime = JSON.parse(localStorage.getItem("totalBreakTime")) || 0;
  longestWorkStreak = JSON.parse(localStorage.getItem("longestWorkStreak")) || 0;
  pomodorosCompletedToday = JSON.parse(localStorage.getItem("pomodorosCompletedToday")) || 0;
}

// Function to set the daily statistics
function resetDailyStats() {
  workSessionsCompleted = 0;
  shortRestsCompleted = 0;
  longRestsCompleted = 0;
  pomodorosCompletedToday = 0;
  currentWorkStreak = 0;
  currentSession = "work";
  localStorage.setItem("workSessionsCompleted", workSessionsCompleted);
  localStorage.setItem("shortRestsCompleted", shortRestsCompleted);
  localStorage.setItem("longRestsCompleted", longRestsCompleted);
  localStorage.setItem("pomodorosCompletedToday", pomodorosCompletedToday);
  localStorage.setItem("currentWorkStreak", currentWorkStreak);
}

// Function that starts the timer
function startTimer() {
  loadSettings();
  if (!timer) {
    timer = setInterval(() => {
      timeRemaining--;
      updateBadgeText(timeRemaining);
      browser.runtime.sendMessage({ action: "updateTimer", timeRemaining: timeRemaining });

      if (timeRemaining < 0) {
        browser.browserAction.setBadgeText({ text: "" });
        clearInterval(timer);
        timer = null;
        browser.runtime.sendMessage({ action: "clearTimerText" });
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

    if ((sessionCount === 0) || (shortRestsRemaining === 0)) {
      switchPopup("../session/session-rest.html");
      openNewTab("../page/page-long-rest.html");
      currentSession = "longBreak";
      timeRemaining = longRestTime;
      shortRestsRemaining = localStorage.getItem("sessionCount") || 4;
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

    localStorage.setItem("workSessionsCompleted", workSessionsCompleted);
    localStorage.setItem("totalWorkTime", totalWorkTime);
    localStorage.setItem("longestWorkStreak", longestWorkStreak);
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

    localStorage.setItem("totalBreakTime", totalBreakTime);
    localStorage.setItem("shortRestsRemaining", shortRestsRemaining);
    localStorage.setItem("longRestsRemaining", longRestsRemaining);
    localStorage.setItem("pomodorosCompletedToday", pomodorosCompletedToday);
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

  browser.browserAction.setBadgeText({ text: "" });
}

// Function to stop the timer
function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  updateBadgeText(timeRemaining);
  browser.runtime.sendMessage({ action: "updateTimer", timeRemaining: timeRemaining });
}

// Function to get the daily date
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Function to switch popups
function switchPopup(popupPage) {
  browser.browserAction.setPopup({ popup: popupPage });
}

// Function to open a new tab
function openNewTab(page) {
  browser.tabs.create({ url: page });
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
  browser.browserAction.setBadgeText({ text: badgeText });

  if (currentSession === "work") {
    browser.browserAction.setBadgeBackgroundColor({ color: " #be003f " });
  } else {
    browser.browserAction.setBadgeBackgroundColor({ color: " #25be00 " });
  }
}

// Function that saves the daily statistics: Question is, how do I know what stats to check
function saveDailyStats() {
  const today = getTodayDateString();
  const statsByDate = JSON.parse(localStorage.getItem("statsByDate")) || {};

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

  localStorage.setItem("statsByDate", JSON.stringify(statsByDate));
  localStorage.setItem("totalWorkTime", JSON.stringify(totalWorkTime));
  localStorage.setItem("totalBreakTime", JSON.stringify(totalBreakTime));
  localStorage.setItem("longestWorkStreak", JSON.stringify(longestWorkStreak));
  localStorage.setItem("pomodorosCompletedToday", JSON.stringify(pomodorosCompletedToday));
  localStorage.setItem("lastSavedDate", today);
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "startTimer") {
    startTimer();
  } else if (message.action === "pauseTimer") {
    pauseTimer();
  } else if (message.action === "resetTimer") {
    resetTimer();
  } else if (message.action === "setToWorkSession") {
    workSessionsCompleted--;
    currentSession = "work";
    timeRemaining = workTime;
    browser.browserAction.setBadgeText({ text: "" });
    browser.browserAction.setBadgeBackgroundColor({ color: "#be003f" });
  }
});

loadSettings();