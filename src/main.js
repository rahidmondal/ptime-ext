let hours = 0;
let minutes = 25;
let seconds = 59;
let hoursInput = 0;
let minutesInput = 25;
let secondsInput = 59;
let timerInterval = null ;


// Timer Wrapper Related DOM Elements
const timerWrapper = document.getElementById("timer-wrapper");
const timerText = document.getElementById("timer");
const triggerButton = document.getElementById("trigger");
const editTimerButton = document.getElementById("edit-timer");
const resetTimerButton = document.getElementById("reset-timer");




// Edit Wrapper Related DOM Elements
const editWrapper = document.getElementById("edit-wrapper");
const saveButton = document.getElementById("save");


// Timer Related Event Listeners
triggerButton.addEventListener("click",()=>{
    if(triggerButton.textContent === "Start"){
        triggerButton.textContent = "Pause"; 
        timerInterval = setInterval(() => {
            if(seconds === 0 && minutes === 0 & hours === 0){
                triggerButton.textContent = "Start";
                clearInterval(timerInterval);
                alert("Timer End!!")
            }else{
                if(seconds === 0){
                    seconds = 59;
                    if(minutes === 0){
                        minutes = 59;
                        hours--;
                    }else{
                        minutes--;
                    }
                }else{
                    seconds--;
                }
            }
            updateTimerDisplay();
        }, 1000);
    }else{
        clearInterval(timerInterval);
        triggerButton.textContent = "Start";
    }
});

editTimerButton.addEventListener("click", () => {
    timerWrapper.classList.add("hidden");
    editWrapper.classList.remove("hidden");
})

resetTimerButton.addEventListener("click", () => {
    triggerButton.textContent = "Start";
    resetToInput();
});


// Edit Related Event Listeners
saveButton.addEventListener("click", () => {
    editWrapper.classList.add("hidden");
    timerWrapper.classList.remove("hidden");
    hoursInput = parseInt(document.getElementById("hours").value);
    minutesInput = parseInt(document.getElementById("minutes").value);
    secondsInput = parseInt(document.getElementById("seconds").value);
    if (isNaN(hoursInput) || isNaN(minutesInput) || isNaN(secondsInput)) {
        hoursInput = 0;
        minutesInput = 0;
        secondsInput = 0;
        alert("Please enter a valid number for hours, minutes and seconds");
    }
    resetToInput();
})



function formatTime(unit) {
    return String(unit).padStart(2, "0")
}

function updateTimerDisplay() {
    const formattedHours = formatTime(hours);
    const formattedMinutes = formatTime(minutes);
    const formattedSeconds = formatTime(seconds);

    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    timerText.textContent = formattedTime;
}


function resetToInput() {
    hours = hoursInput;
    minutes = minutesInput;
    seconds = secondsInput;
    clearInterval(timerInterval);
    updateTimerDisplay();
    triggerButton.textContent = "Start";
}