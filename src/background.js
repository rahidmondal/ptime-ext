let timerState = {
  hours: 0,
  minutes: 55,
  seconds: 59,
  isRunning: false,
  intervalId: null,
};

let editState = {
  hours: 0,
  minutes: 55,
  seconds: 59,
  isRunning: false,
  intervalId: null,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["timerState", "editState"], (result) => {
    if (!result.timerState) {
      chrome.storage.local.set({ timerState });
    }
    if (!result.editState) {
      chrome.storage.local.set({ editState });
    }
  });
});

chrome.storage.local.get("timerState", (result) => {
  if (result.timerState) {
    timerState = result.timerState;
  }
});

function startTimer() {
  if (timerState.isRunning) return;
  if (
    timerState.hours < 0 ||
    timerState.minutes < 0 ||
    timerState.seconds < 0
  ) {
    clearInterval(timerState.intervalId);
    timerState.isRunning = false;
    return;
  }

  timerState.isRunning = true;
  timerState.intervalId = setInterval(() => {
    if (
      timerState.seconds === 0 &&
      timerState.minutes === 0 &&
      timerState.hours === 0
    ) {
      clearInterval(timerState.intervalId);
      timerState.isRunning = false;
      chrome.runtime.sendMessage({ type: "timerEnd" });
      chrome.runtime.sendMessage({ type: "playAlarm" });
    } else {
      if (timerState.seconds === 0) {
        timerState.seconds = 59;
        if (timerState.minutes === 0) {
          timerState.minutes = 59;
          timerState.hours--;
        } else {
          timerState.minutes--;
        }
      } else {
        timerState.seconds--;
      }
    }
    updateStorage();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerState.intervalId);
  timerState.isRunning = false;
  updateStorage();
}

function resetTimer() {
  if (timerState.intervalId) clearInterval(timerState.intervalId);
  timerState.isRunning = false;
  timerState.hours = editState.hours || 0;
  timerState.minutes = editState.minutes || 0;
  timerState.seconds = editState.seconds || 0;
  updateStorage();
}

function updateStorage() {
  chrome.storage.local.set({ timerState });
}

function updateEditValue(hours, minutes, seconds) {
  clearInterval(editState.intervalId);
  editState = {
    hours,
    minutes,
    seconds,
    isRunning: false,
    intervalId: null,
  };
  chrome.storage.local.set({ editState });
  resetTimer();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startTimer") {
    startTimer();
  } else if (message.type === "pauseTimer") {
    pauseTimer();
  } else if (message.type === "resetTimer") {
    resetTimer();
  } else if (message.type === "resetEditValues") {
    updateEditValue(message.hours, message.minutes, message.seconds);
  } else if (message.type === "getEditState") {
    chrome.storage.local.get("editState", (result) => {
      sendResponse(result.editState || editState);
    });
    return true;
  } else if (message.type === "getTimerState") {
    chrome.storage.local.get("timerState", (result) => {
      sendResponse(result.timerState || timerState);
    });
    return true;
  }
});
