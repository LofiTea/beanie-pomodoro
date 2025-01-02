let workDuration;
let shortBreakDuration;
let longBreakDuration;
let sessionCount = 0;
let workSessionsCompleted = 0;
let pomodorosCompleted = 0;
let shortRestsRemaining = 0;
let shortRestsCompleted = 0;
let longRestsCompleted = 0;

let totalWorkTime = 0;
let totalBreakTime = 0;
let longestWorkStreak = 0;
let currentWorkStreak = 0;
let pomodorosCompletedToday = 0;

let timer;
let currentSession = "work";
let timeRemaining;
let notificationSoundEnabled;
let toolbarBadgeEnabled;

function loadSettings() {
  workDuration = JSON.parse(localStorage.getItem("workTime")) * 60 || 25 * 60;
  shortBreakDuration =
    JSON.parse(localStorage.getItem("shortRestTime")) * 60 || 5 * 60;
  longBreakDuration =
    JSON.parse(localStorage.getItem("longRestTime")) * 60 || 15 * 60;
  notificationSoundEnabled =
    JSON.parse(localStorage.getItem("notificationSound")) || false;
  toolbarBadgeEnabled =
    JSON.parse(localStorage.getItem("toolbarBadge")) || true;
  sessionCount = 0;
  timeRemaining = workDuration;

  totalWorkTime = JSON.parse(localStorage.getItem("totalWorkTime")) || 0;
  totalBreakTime = JSON.parse(localStorage.getItem("totalBreakTime")) || 0;
  longestWorkStreak =
    JSON.parse(localStorage.getItem("longestWorkStreak")) || 0;
  pomodorosCompletedToday =
    JSON.parse(localStorage.getItem("pomodorosCompletedToday")) || 0;

  const sessionCountSetting = localStorage.getItem("sessionCount") || 4;
  shortRestsRemaining = sessionCountSetting;
}

/** For debugging purposes:
function loadSettings() {
  workDuration = 0.05 * 60;
  shortBreakDuration = 0.05 * 60;
  longBreakDuration = 0.01 * 60;
  notificationSoundEnabled = JSON.parse(localStorage.getItem("notificationSound")) || false;
  toolbarBadgeEnabled = JSON.parse(localStorage.getItem("toolbarBadge")) || true;
  sessionCount = 0;
  timeRemaining = workDuration;

  totalWorkTime = JSON.parse(localStorage.getItem("totalWorkTime")) || 0;
  totalBreakTime = JSON.parse(localStorage.getItem("totalBreakTime")) || 0;
  longestWorkStreak = JSON.parse(localStorage.getItem("longestWorkStreak")) || 0;
  pomodorosCompletedToday = JSON.parse(localStorage.getItem("pomodorosCompletedToday")) || 0;

  const sessionCountSetting = localStorage.getItem("sessionCount") || 4;
  shortRestsRemaining = sessionCountSetting;
}
*/

function saveDailyStats() {
  const today = getTodayDateString();
  const statsByDate = JSON.parse(localStorage.getItem("statsByDate")) || {};

  if (!statsByDate[today]) {
    statsByDate[today] = {
      workSessionsCompleted: 0,
      shortRestsCompleted: 0,
      longRestsCompleted: 0,
      pomodorosCompleted: 0,
      totalWorkTime: 0,
      totalBreakTime: 0,
      longestWorkStreak: 0,
    };
  }

  statsByDate[today].workSessionsCompleted = workSessionsCompleted;
  statsByDate[today].shortRestsCompleted = shortRestsCompleted;
  statsByDate[today].longRestsCompleted = longRestsCompleted;
  statsByDate[today].pomodorosCompleted = pomodorosCompleted;
  statsByDate[today].totalWorkTime = totalWorkTime;
  statsByDate[today].totalBreakTime = totalBreakTime;
  statsByDate[today].longestWorkStreak = longestWorkStreak;

  localStorage.setItem("statsByDate", JSON.stringify(statsByDate));
  localStorage.setItem("totalWorkTime", JSON.stringify(totalWorkTime));
  localStorage.setItem("totalBreakTime", JSON.stringify(totalBreakTime));
  localStorage.setItem("longestWorkStreak", JSON.stringify(longestWorkStreak));
  localStorage.setItem("pomodorosCompletedToday", JSON.stringify(pomodorosCompletedToday));
}

function startTimer() {
  if (!timer) {
    startCountdown();
  }
}

function startCountdown() {
  timer = setInterval(() => {
    timeRemaining--;

    if (toolbarBadgeEnabled) {
      updateBadgeText(timeRemaining);
    } else {
      browser.browserAction.setBadgeText({ text: "" });
    }

    browser.runtime.sendMessage({ action: "updateTimer", timeRemaining: timeRemaining, });

    if (timeRemaining < 0) {
      clearInterval(timer);
      timer = null;
      browser.browserAction.setBadgeText({ text: "" });

      browser.runtime.sendMessage({ action: "clearTimerText" });

      if (notificationSoundEnabled) {
        playNotificationSound();
      }

      sessionCompleted();
    }
  }, 1000);
}

function sessionCompleted() {
  if (currentSession === "work") {
    sessionCount++;
    workSessionsCompleted++;
    shortRestsRemaining--;

    totalWorkTime += workDuration;
    currentWorkStreak++;

    if (currentWorkStreak > longestWorkStreak) {
      longestWorkStreak = currentWorkStreak;
    }

    localStorage.setItem("workSessionsCompleted", workSessionsCompleted);
    localStorage.setItem("pomodorosCompleted", pomodorosCompleted);
    localStorage.setItem("shortRestsRemaining", shortRestsRemaining);

    saveDailyStats();

    if (sessionCount === 0 || shortRestsRemaining === 0) {
      switchPopup("../session/session-rest.html");
      openNewTab("../page/page-long-rest.html");
      currentSession = "longBreak";
      timeRemaining = longBreakDuration;
      shortRestsRemaining = localStorage.getItem("sessionCount") || 4;
      longRestsCompleted++;
    } else {
      switchPopup("../session/session-rest.html");
      openNewTab("../page/page-short-rest.html");
      currentSession = "shortBreak";
      timeRemaining = shortBreakDuration;
      shortRestsCompleted++;
    }
  } else {
    pomodorosCompleted++;

    if (currentSession === "shortBreak") {
      totalBreakTime += shortBreakDuration;
    } else if (currentSession === "longBreak") {
      totalBreakTime += longBreakDuration;
    }

    pomodorosCompletedToday++; 

    currentWorkStreak = 0;

    if (currentSession === "longBreak") {
      openNewTab("../page/page-work-long-rest.html");
    } else {
      openNewTab("../page/page-work.html");
    }
    switchPopup("../session/session-work.html");
    currentSession = "work";
    timeRemaining = workDuration;

    localStorage.setItem("pomodorosCompleted", pomodorosCompleted);

    saveDailyStats();
  }
}

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function switchPopup(popupPage) {
  browser.browserAction.setPopup({ popup: popupPage });
}

function openNewTab(page) {
  browser.tabs.create({ url: page });
}

function updateBadgeText(timeRemaining) {
  const minutes = Math.floor(timeRemaining / 60);
  const badgeText = minutes > 0 ? `${minutes}m` : `<1m`;
  browser.browserAction.setBadgeText({ text: badgeText });

  if (currentSession === "work") {
    browser.browserAction.setBadgeBackgroundColor({ color: "red" });
  } else {
    browser.browserAction.setBadgeBackgroundColor({ color: "green" });
  }
}

function playNotificationSound() {
  const audio = new Audio("../assets/sounds/portal.mp3");
  audio.play();
}

function resetTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  if (currentSession === "work") {
    timeRemaining = workDuration;
  } else if (currentSession === "shortBreak") {
    timeRemaining = shortBreakDuration;
  } else if (currentSession === "longBreak") {
    timeRemaining = longBreakDuration;
  }

  browser.browserAction.setBadgeText({ text: "" });
}


browser.runtime.onMessage.addListener((message) => {
  if (message.action === "startTimer") {
    startTimer();
  } else if (message.action === "resetTimer") {
    resetTimer();
  }
});

loadSettings();