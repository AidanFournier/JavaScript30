const video = document.querySelector('.player'); // this is coming from webcame
const canvas = document.querySelector('.photo'); // screenshots coming from video
const ctx = canvas.getContext('2d'); // where the work happens
const strip = document.querySelector('.strip'); // where we put all of our images
const snap = document.querySelector('.snap'); // audio

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
        // console.log(localMediaStream);
        
    //  DEPRECIATION : 
    //       The following has been depreceated by major browsers as of Chrome and Firefox.
    //       video.src = window.URL.createObjectURL(localMediaStream);
    //       Please refer to these:
    //       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
        
        video.srcObject = localMediaStream;
        video.play();
        })
        .catch(err => { // in  case someone doesn't allow you to access their webcam
        console.error(`OH NO!!!`, err);
        });
}

  // next thing  we need to do is take a frame from this video and paint it onto the cnavas on the screen

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        // pixels = redEffect(pixels);

        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.1;

        pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto()  {
    // play the sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a'); // create link
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // RED
        pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
        pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3]; // transparency pixel
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas); // once the vieeo is played, it's going to emit an event called canPlay, which in turn canvas will say oh now we can paint to canvas