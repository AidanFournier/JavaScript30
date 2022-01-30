// function timer(seconds) {
//     setInterval(function() {
//         seconds--; // decrement the amount of seconds every time
//     }, 1000); // run every second
// }
// ^ this gave issues because sometimes setInterval would just stop running
// on IOS, it will pause intervals while scrolling

let countdown; // global variable
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');

const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    // when we start a new timer by clicking on  a button, clear any existng timers
    clearInterval(countdown); // if there is a timer in countdown, it will clear, if not the variiable still exists and won't error out

    // figure out when the timer started
    const now = Date.now();
    const then = now + seconds * 1000 // multiply because now is in ms
    // every single second, we need to display the time left
    // okay to use interval here, less concerned about it running every single second if something happens
    displayTimeLeft(seconds); // run it immediately once (so first  second isn't skipped in display), then run it again below
    displayEndTime(then); // doesn't need to be in interval, just needs to run once at beginning to show
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop it!
        if(secondsLeft < 0) {
            // need to store setInterval variable in countdown
            clearInterval(countdown);
            return; // 
        }
        // display it
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    // now deal with it converting to sec, min, hrs
    const minutes = Math.floor(seconds / 60); // use floor because we just want the lower end of that number
    const remainderSeconds = seconds % 60; // % gives us remainder
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = display; // document.title is the title tag in your html
    timerDisplay.textContent = display;
}

// show ending time aka "Be back at 2:40pm"
function displayEndTime(timestamp) { // timestamp wll be our then const
    // Date.now() gives us number of millisec since Jan 1 1970
    // if you pass Date.now() this number of ms, it will return today's date and time
    const end = new Date(timestamp);
    const hour = end.getHours();
    const adjustedHour = hour > 12 ? hour -12 : hour; // account for 24hr time format
    const minutes = end.getMinutes();
    endTime.textContent = `Be back at ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`; 
}

function startTimer() {
    // console.log(this); // how do we get this data-time out of the obejct?
    // console.log(this.dataset.time);
    const seconds = parseInt(this.dataset.time); // turn it into a real number, not string
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

// if an  element has a custom name (ex. name="customForm"), you can select with document.customForm and get the element
// similarly, if the input nested inside that element has a name, you can select it with document.customForm.minutes
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mins = this.minutes.value; //.this is the form, minutes is the textboxd we type value into
    console.log(mins);
    timer(mins * 60); // our timer requires seconds, not mins, so * 60
    this.reset(); // to clear out previous value
});