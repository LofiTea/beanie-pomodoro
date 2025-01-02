document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("pomodoro-chart").getContext("2d");
  const workSessionCountEl = document.getElementById("work-session-count");
  const shortRestSessionCountEl = document.getElementById("short-rest-session-count");
  const longRestSessionCountEl = document.getElementById("long-rest-session-count");
  const totalWorkTimeEl = document.getElementById("total-work-time");
  const totalBreakTimeEl = document.getElementById("total-break-time");
  const longestWorkStreakEl = document.getElementById("longest-work-streak");
  const pomodorosCompletedTodayEl = document.getElementById("pomodoros-completed-today");
  const datePicker = document.getElementById("date-picker");
  const timeRangeSelector = document.getElementById("time-range");
  const pomodoroChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "# of Pomodoros",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  const today = getTodayDateString();
  updateSessionCounts(today);
  updateChart(timeRangeSelector.value);

  datePicker.addEventListener("change", () => {
    const selectedDate = datePicker.value;
    updateSessionCounts(selectedDate);
  });

  timeRangeSelector.addEventListener("change", () => {
    updateChart(timeRangeSelector.value);
  });

  function updateSessionCounts(date) {
    const statsByDate = JSON.parse(localStorage.getItem("statsByDate")) || {};

    if (statsByDate[date]) {
      workSessionCountEl.textContent = statsByDate[date].workSessionsCompleted || 0;
      shortRestSessionCountEl.textContent = statsByDate[date].shortRestsCompleted || 0;
      longRestSessionCountEl.textContent = statsByDate[date].longRestsCompleted || 0;

      totalWorkTimeEl.textContent = formatTime(statsByDate[date].totalWorkTime || 0);
      totalBreakTimeEl.textContent = formatTime(statsByDate[date].totalBreakTime || 0);
      longestWorkStreakEl.textContent = statsByDate[date].longestWorkStreak || 0;
      pomodorosCompletedTodayEl.textContent = statsByDate[date].pomodorosCompleted || 0;
    } else {
      workSessionCountEl.textContent = 0;
      shortRestSessionCountEl.textContent = 0;
      longRestSessionCountEl.textContent = 0;
      totalWorkTimeEl.textContent = formatTime(0);
      totalBreakTimeEl.textContent = formatTime(0);
      longestWorkStreakEl.textContent = 0;
      pomodorosCompletedTodayEl.textContent = 0;
    }
  }

  function updateChart(days) {
    const statsByDate = JSON.parse(localStorage.getItem("statsByDate")) || {};
    const totalPomodoros = [];
    const labels = [];

    const dates = Object.keys(statsByDate).sort((a, b) => new Date(b) - new Date(a)).slice(0, days);
    dates.reverse().forEach((date) => {
      const pomodorosCompleted = statsByDate[date].pomodorosCompleted || 0;
      totalPomodoros.push(pomodorosCompleted);
      labels.push(date);
    });

    pomodoroChart.data.labels = labels;
    pomodoroChart.data.datasets[0].data = totalPomodoros;
    pomodoroChart.update();
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }
});