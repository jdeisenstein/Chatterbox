// set up basic variables for app

const record = document.querySelector('.record');
//const stop = document.querySelector('.stop');
const next = document.querySelector('.next');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

// deactivate the TALK/stop button until after the prompt has finished

record.disabled         = true;
record.style.background = "gray";
record.style.color      = "lightgray";
record.innerHTML        = "PRESS to TALK";

// deactivate the next/Repeat button after the prompt finishes

next.disabled           = true;
next.style.background   = "gray";
next.style.color        = "lightgray";
next.innerHTML          = "REPEAT QUESTION";

// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };

  let chunks = [];

  let onSuccess = function (stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    // The prompt has played and TALK/stop is now active as is the REPEAT/next button
    // If Talk/stop is pressed, REPEAT/next is immeditely deactivated
    record.onmousedown = function () {
      mediaRecorder.start();

      console.log("****recorder starts *****");
      console.log(mediaRecorder.state);

// the talk button turns red when pressed and remains that way until released
      record.style.background   = "red";
      record.style.color        = "white"
      record.innerHTML          = "RELEASE to STOP";
    }

    record.onmouseup = function () {
      mediaRecorder.stop();

      console.log("**** recorder stops ****");
      console.log(mediaRecorder.state);

      // when talk button is released, recording stops and talk button is deactivated. 

      record.style.color        = "lightgray";
      record.innerHTML          = "PRESS to TALK";
      record.disabled           = true;
 
      // and next button, is activated to call for the next prompt.
      
      next.disabled             = false;
      next.innerHTML            = "NEXT QUESTION";
      next.style.background     = "blue";
      next.style.color          = "white";

      //record.style.color = "";
      // mediaRecorder.requestData();

      //stop.disabled = true;
    }
    // The prompt has played and REPEAT/next is now active as is the TALK/stop button
    // If REPEAT/next is pressed, TALK/stop is immeditely deactivated.  
    // The prompt is replayed and the REPEAT/next button is deactivated until the prompt has finished again
    // Then both buttons are once again reactivated.  I should implement these as functions!

    next.onClick = function () {
      // queue next prompt and play it here 

      // console.log(mediaRecorder.state);
      console.log("queue the prompt and roll");

      // after "REPEAT/next" is clicked, disable it until after the prompt has played
      // and deactivate the TALK/stop button too.  This handler needs to track its state,
      // whether it's in REPEAT/next or repeat/NEXT mode.

      next.innerHTML          = "REPEAT QUESTION";
      next.style.background   = "gray";
      next.style.color        = "lightgray";
      next.disabled           = true;

      // after prompt plays, reenable "TALK/stop" and "REPLAY/next"
      // Once Talk is pressed REPLAY/next becomes replay/NEXT but remains disabled 
      // until the talk/STOP button is released, is disabled and becomes TALK/stop

      record.disabled         = false;
      record.style.background = "green";
      record.style.color      = "white"
      record.innerHTML        = "PRESS to TALK";

      //mediaRecorder.start();
      //console.log(mediaRecorder.state);
      //console.log("recorder started");
      //record.style.background = "red";
      //record.innerHTML = "RELEASE to STOP";
    }



    mediaRecorder.onstop = function (e) {
      console.log("data available after MediaRecorder.stop() called.");

      const clipName = prompt('Enter a name for your sound clip?', 'My unnamed clip');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if (clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, {
        'type': 'audio/ogg; codecs=opus'
      });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

      deleteButton.onclick = function (e) {
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function () {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if (newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    }
  }

  let onError = function (err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
  console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 255, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for (let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

  }
}

window.onresize = function () {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();