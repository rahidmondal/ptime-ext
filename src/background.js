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

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("timerState", (result) => {
    if (result.timerState && result.timerState.isRunning) {
      result.timerState.isRunning = false;
      result.timerState.intervalId = null;
      chrome.storage.local.set({ timerState: result.timerState });
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["timerState", "editState"], (result) => {
    if (!result.timerState) {
      chrome.storage.local.set({ timerState });
    } else {
      timerState = result.timerState;
      timerState.isRunning = false;
      timerState.intervalId = null;
      chrome.storage.local.set({ timerState });
    }

    if (!result.editState) {
      chrome.storage.local.set({ editState });
    } else {
      editState = result.editState;
    }
  });
  chrome.alarms.create("checkTimer", { periodInMinutes: 1/60 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkTimer") {
    chrome.storage.local.get("timerState", (result) => {
      if (result.timerState && result.timerState.isRunning) {
        const totalSeconds = result.timerState.hours * 3600 + 
                           result.timerState.minutes * 60 + 
                           result.timerState.seconds;
        if (totalSeconds <= 10) {
          chrome.action.openPopup();
        }
      }
    });
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  chrome.windows.getAll((windows) => {
    if (windows.length === 0) {
      cleanupTimer();
    }
  });
});

chrome.runtime.onSuspend.addListener(() => {
  cleanupTimer();
});

function cleanupTimer() {
  if (timerState.intervalId) {
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
  }
  timerState.isRunning = false;
  
  chrome.storage.local.set({ timerState }, () => {
    console.log('Timer state cleaned up and saved');
  });
}

function startTimer() {
  chrome.storage.local.get("timerState", (result) => {
    const storedTimerState = result.timerState || timerState;

    if (storedTimerState.isRunning) return;

    if (
      storedTimerState.hours < 0 ||
      storedTimerState.minutes < 0 ||
      storedTimerState.seconds < 0
    ) {
      clearInterval(storedTimerState.intervalId);
      storedTimerState.isRunning = false;
      updateStorage();
      return;
    }

    timerState = storedTimerState;
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
    updateStorage();
  });
}

function pauseTimer() {
  chrome.storage.local.get("timerState", (result) => {
    const storedTimerState = result.timerState || timerState;
    timerState = storedTimerState;
    cleanupTimer();
  });
}

function resetTimer() {
  chrome.storage.local.get("editState", (result) => {
    const savedEditState = result.editState || editState;
    if (timerState.intervalId) clearInterval(timerState.intervalId);
    timerState.isRunning = false;
    timerState.intervalId = null;
    timerState.hours = savedEditState.hours;
    timerState.minutes = savedEditState.minutes;
    timerState.seconds = savedEditState.seconds;
    updateStorage();
  });
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