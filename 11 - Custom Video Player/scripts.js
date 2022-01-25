// 1. Get our elements

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// 2. Build out functions


// Play & pause:
function togglePlay() {
    // another way, but a little confusing to read:
    // const method = video.paused ? 'play' : 'pause';
    // video[method]();
    if(video.paused) { // paused is a property that exists on the video
        video.play();
    } else {
        video.pause();
    }
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚'; // 'this' is bound to the video itself
    // console.log(icon);
    toggle.textContent = icon;
    // console.log('update the button');
}

// Skip buttons
function skip() {
    console.log(this.dataset.skip);
    video.currentTime += parseFloat(this.dataset.skip); // parse because it is a string (ex. "-10")
}

// Ranges:
function handleRangeUpdate() {
    video[this.name] = this.value;
}

// Progress bar:
function handleProgress() {
    // update the flex-basis value of .progress_filled class
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    console.log(e);
}

// 3. Hook up the event listeners

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress); // for progress bar

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e)); // when someone moves their mouse, we first check the variable mousedown, and if this variable is true, it moves on to scrub; if it's false, mousedown returns false and it's not going to do anything
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// next challenge: put in a fullscreen button and make it work