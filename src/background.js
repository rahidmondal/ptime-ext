let timerState = {
    hours: 0,
    minutes: 55,
    seconds: 59,
    isRunning: false,
    intervalId: null,
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get("timerState", (result) => {
        if (!result.timerState) {
            chrome.storage.local.set({ timerState });
        } else {
            timerState = result.timerState;
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

    timerState.isRunning = true;
    timerState.intervalId = setInterval(() => {
        if (timerState.seconds === 0 && timerState.minutes === 0 && timerState.hours === 0) {
            clearInterval(timerState.intervalId);
            timerState.isRunning = false;
            chrome.runtime.sendMessage({ type: "timerEnd" });
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

function resetTimer(hours, minutes, seconds) {
    clearInterval(timerState.intervalId);
    timerState = {
        hours,
        minutes,
        seconds,
        isRunning: false,
        intervalId: null,
    };
    updateStorage();
}

function updateStorage() {
    chrome.storage.local.set({ timerState });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "startTimer") {
        startTimer();
    } else if (message.type === "pauseTimer") {
        pauseTimer();
    } else if (message.type === "resetTimer") {
        resetTimer(message.hours, message.minutes, message.seconds);
    } else if (message.type === "getTimerState") {
        chrome.storage.local.get("timerState", (result) => {
            sendResponse(result.timerState || timerState);
        });
        return true;  
    }
});
