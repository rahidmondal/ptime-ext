let hoursInput = parseInt(document.getElementById("hours").value);
let minutesInput = parseInt(document.getElementById("minutes").value);
let secondsInput = parseInt(document.getElementById("seconds").value);

// Timer Wrapper Related DOM Elements
const timerWrapper = document.getElementById("timer-wrapper");
const timerText = document.getElementById("timer");
const triggerButton = document.getElementById("trigger");
const editTimerButton = document.getElementById("edit-timer");
const resetTimerButton = document.getElementById("reset-timer");


// Edit Wrapper Related DOM Elements
const editWrapper = document.getElementById("edit-wrapper");
const saveButton = document.getElementById("save");
const returnButton = document.getElementById("returnButton");


// Timer Related Event Listeners
triggerButton.addEventListener("click",()=>{
    if(triggerButton.textContent === "Start"){
        chrome.runtime.sendMessage({type:"startTimer"});
    }else{
        chrome.runtime.sendMessage({type:"pauseTimer"});
    }
});

editTimerButton.addEventListener("click", () => {
    timerWrapper.classList.add("hidden");
    editWrapper.classList.remove("hidden");
})

resetTimerButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({
        type : "resetTimer",
        hours : hoursInput,
        minutes : minutesInput,
        seconds : secondsInput,
    });
    triggerButton.textContent = "Start";
    refreshTimer();
});


// Edit Related Event Listeners
saveButton.addEventListener("click", () => {
    editWrapper.classList.add("hidden");
    timerWrapper.classList.remove("hidden");
    hoursInput = parseInt(document.getElementById("hours").value);
    minutesInput = parseInt(document.getElementById("minutes").value);
    secondsInput = parseInt(document.getElementById("seconds").value);
    if (isNaN(hoursInput) || isNaN(minutesInput) || isNaN(secondsInput)) {
        alert("Please enter a valid number for hours, minutes and seconds");
        return;
    }

    chrome.runtime.sendMessage({
        type:"resetTimer",
        hours : hoursInput,
        minutes : minutesInput,
        seconds : secondsInput,
    });
    editWrapper.classList.add("hidden");
    timerWrapper.classList.remove("hidden");
    refreshTimer();
});

// Return Button Event Listener
returnButton.addEventListener("click", () => {
    editWrapper.classList.add("hidden"); // Hide edit
    timerWrapper.classList.remove("hidden"); // Show timer
});

function formatTime(unit) {
    return String(unit).padStart(2, "0")
}

function updateTimerDisplay(hours,minutes,seconds) {
    const formattedHours = formatTime(hours);
    const formattedMinutes = formatTime(minutes);
    const formattedSeconds = formatTime(seconds);

    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    timerText.textContent = formattedTime;
}






function refreshTimer(){
    chrome.runtime.sendMessage({type:"getTimerState"},(state)=>{
        if(state){
            updateTimerDisplay(state.hours,state.minutes,state.seconds);
            triggerButton.textContent = state.isRunning ? "Pause":"Start";
        }
    });
}

setInterval(refreshTimer,1000);
refreshTimer();