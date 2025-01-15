document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("pomodoro-chart").getContext("2d");
  const workSessionCount = document.getElementById("work-session-count");
  const shortRestSessionCount = document.getElementById("short-rest-session-count");
  const longRestSessionCount = document.getElementById("long-rest-session-count");
  const totalWorkTime = document.getElementById("total-work-time");
  const totalBreakTime = document.getElementById("total-break-time");
  const longestWorkStreak = document.getElementById("longest-work-streak");
  const pomodorosCompletedToday = document.getElementById("pomodoros-completed-today");
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
      workSessionCount.textContent = statsByDate[date].workSessionsCompleted || 0;
      shortRestSessionCount.textContent = statsByDate[date].shortRestsCompleted || 0;
      longRestSessionCount.textContent = statsByDate[date].longRestsCompleted || 0;
      totalWorkTime.textContent = formatTime(statsByDate[date].totalWorkTime || 0);
      totalBreakTime.textContent = formatTime(statsByDate[date].totalBreakTime || 0);
      longestWorkStreak.textContent = statsByDate[date].longestWorkStreak || 0;
      pomodorosCompletedToday.textContent = statsByDate[date].pomodorosCompletedToday || 0;
    } else {
      workSessionCount.textContent = 0;
      shortRestSessionCount.textContent = 0;
      longRestSessionCount.textContent = 0;
      totalWorkTime.textContent = formatTime(0);
      totalBreakTime.textContent = formatTime(0);
      longestWorkStreak.textContent = 0;
      pomodorosCompletedToday.textContent = 0;
    }
  }

  function updateChart(days) {
    const statsByDate = JSON.parse(localStorage.getItem("statsByDate")) || {};
    const totalPomodoros = [];
    const labels = [];

    const dates = Object.keys(statsByDate).sort((a, b) => new Date(b) - new Date(a)).slice(0, days);
    dates.reverse().forEach((date) => {
      const pomodorosCompletedToday = statsByDate[date].pomodorosCompletedToday || 0;
      totalPomodoros.push(pomodorosCompletedToday);
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