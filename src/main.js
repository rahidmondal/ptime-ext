const timerWrapper = document.getElementById("timer-wrapper");
const timerText = document.getElementById("timer");
const triggerButton = document.getElementById("trigger");
const editTimerButton = document.getElementById("edit-timer");
const resetTimerButton = document.getElementById("reset-timer");

const editWrapper = document.getElementById("edit-wrapper");
const saveButton = document.getElementById("save");
const returnButton = document.getElementById("returnButton");

const alarmSound = new Audio("./resource/alarm.mp3");

triggerButton.addEventListener("click", () => {
  if (triggerButton.textContent === "Start") {
    chrome.runtime.sendMessage({ type: "startTimer" });
  } else {
    chrome.runtime.sendMessage({ type: "pauseTimer" });
  }
});

editTimerButton.addEventListener("click", () => {
  timerWrapper.classList.add("hidden");
  editWrapper.classList.remove("hidden");
  resetEditValues();
});

resetTimerButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({
    type: "resetTimer",
  });
  triggerButton.textContent = "Start";
  refreshTimer();
});

saveButton.addEventListener("click", () => {
  editWrapper.classList.add("hidden");
  timerWrapper.classList.remove("hidden");
  let hoursInput = parseInt(document.getElementById("hours").value);
  let minutesInput = parseInt(document.getElementById("minutes").value);
  let secondsInput = parseInt(document.getElementById("seconds").value);
  if (isNaN(hoursInput) || isNaN(minutesInput) || isNaN(secondsInput)) {
    alert("Please enter a valid number for hours, minutes and seconds");
    return;
  }
  if (hoursInput < 0 || minutesInput < 0 || secondsInput < 0) {
    alert("Time values cannot be negative");
    return;
  }
  chrome.runtime.sendMessage({
    type: "resetEditValues",
    hours: hoursInput,
    minutes: minutesInput,
    seconds: secondsInput,
  });
  editWrapper.classList.add("hidden");
  timerWrapper.classList.remove("hidden");
  refreshTimer();
});

returnButton.addEventListener("click", () => {
  editWrapper.classList.add("hidden");
  timerWrapper.classList.remove("hidden");
});

function formatTime(unit) {
  return String(unit).padStart(2, "0");
}

function updateTimerDisplay(hours, minutes, seconds) {
  const formattedHours = formatTime(hours);
  const formattedMinutes = formatTime(minutes);
  const formattedSeconds = formatTime(seconds);

  const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  timerText.textContent = formattedTime;
}

function refreshTimer() {
  chrome.runtime.sendMessage({ type: "getTimerState" }, (state) => {
    if (state) {
      updateTimerDisplay(state.hours, state.minutes, state.seconds);
      triggerButton.textContent = state.isRunning ? "Pause" : "Start";
    }
  });
}

function resetEditValues() {
  chrome.runtime.sendMessage({ type: "getEditState" }, (state) => {
    if (state) {
      document.getElementById("hours").value = state.hours;
      document.getElementById("minutes").value = state.minutes;
      document.getElementById("seconds").value = state.seconds;
    }
  });
}

function showCustomAlert(message) {
  const customAlert = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");
  const closeButton = document.getElementById("alert-close");

  alertMessage.textContent = message;

  customAlert.classList.remove("hidden");

  closeButton.addEventListener("click", () => {
    customAlert.classList.add("hidden");
    alarmSound.pause();
    alarmSound.currentTime = 0;
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "playAlarm") {
    alarmSound.play();
    showCustomAlert("Time is up!");
  }
});

setInterval(refreshTimer, 1000);
refreshTimer();