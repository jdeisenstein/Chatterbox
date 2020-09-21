// set up basic variables for app

const recordAnswer   = document.querySelector('.record');
const repeatQuestion = document.querySelector('.repeat');
const nextQuestion   = document.querySelector('.next');
const playPrompt     = document.querySelector('.btn');
const soundClips     = document.querySelector('.sound-clips');
const canvas         = document.querySelector('.visualizer');
const mainSection    = document.querySelector('.main-controls');

const startButtonClickHandler = function () {
    $('#repeat-question-button').on('click', function () {
        console.log(`***** Entering startButtonClickHandler *****`);
        displayDisabledNextQuestionButton();
        displayDisabledRepeatQuestionButton();
        displayDisabledTalkStopButton();

        jQuery(document).ready(function () {
          var audioArray = document.getElementsByClassName('prompts-16');
          var i = 0;
            console.log("audio array:")
            console.log(audioArray[i].duration);
            audioArray[i].play();
            for (i = 0; i < audioArray.length - 1; ++i) {
              audioArray[i].addEventListener('ended', function (e) {
                console.log(`***** the song is over *****`)

                var currentSong = e.target;
                var next = $(currentSong).nextAll('audio');
                if (next.length) $(next[0]).trigger('play');
                });
            }
        });
      
        // when prompt completes, activate Talk/Stop button
        // displayEnabledNextQuestionButton();
        //displayEnabledRepeatQuestionButton();
        //displayEnabledTalkStopButton();
        console.log(`***** Leaving startButtonClickHandler *****`);
    });
}


//repeatButtonClickHandler();

// *** TALK/STOP Button 

const pressTalkStopButton = function () {
  console.log(`***** TALK/stop Button: UP to Down *****`);
  // start recording...
  // Talk diameter => expands to Stop diameter
  // becomes enabled Stop button (release to stop recording)
  displayEnabledStopTalkButton();
  // disable the prompt navigation buttons
  displayDisabledNextQuestionButton();
  displayDisabledRepeatQuestionButton();
}
const releaseStopTalkButton = function () {
  console.log(`***** talk/STOP Button: Down to UP *****`);
  // stop recording...
  // Stop diameter => contracts to Talk diameter
  // Disable TALK/stop button
  displayDisabledTalkStopButton();
  // activate the prompt navigation buttons
  displayEnabledNextQuestionButton();
  displayEnabledRepeatQuestionButton();
}
// *** NEXT QUESTION Button

const pressNextQuestionButton = function () {
  // Next Question button released diameter => expands to pressed diameter 
  console.log(`***** NEXT QUESTION Button: UP to Down *****`);
}
const releaseNextQuestionButton = function () {
  // Next Question button pressed diameter => contracts to released diameter 
  console.log(`***** NEXT QUESTION Button: Down to UP *****`);
}
const clickNextQuestionButton = function () {
  console.log(`***** NEXT QUESTION Button: UP to Down to UP *****`);
  // disable prompt navigation buttons
  displayDisabledNextQuestionButton();
  displayDisabledRepeatQuestionButton();
  // and the Talk button during the prompt playback
  displayDisabledTalkStopButton();
  // and starts playback of the next prompt...

  // when the prompt completes, enable Talk button and Repeat Question button
  displayEnabledTalkStopButton();
  displayEnabledRepeatQuestionButton();
}
// *** REPEAT QUESTION Button

const pressRepeatQuestionButton = function () {
  console.log(`***** REPEAT QUESTION Button: Up to Down *****`);
  // Repeat Question button released diameter => expands to pressed diameter
}
const releaseRepeatQuestionButton = function () {
  console.log(`***** REPEAT QUESTION Button: Down to Up *****`);
  // Repeat Question button pressed diameter => contracts to released diameter
}
const clickRepeatQuestionButton = function () {
  console.log(`***** REPEAT QUESTION Button: Up to Down to Up *****`);
  // Disable Talk/stop button & Repeat Question button & Next Question button
  displayDisabledNextQuestionButton();
  displayDisabledRepeatQuestionButton();
  displayDisabledTalkStopButton();
  // start replay of current prompt.

  // when prompt completes, activate Talk/Stop button
  displayEnabledNextQuestionButton();
  displayEnabledRepeatQuestionButton();
  displayEnabledTalkStopButton();
}
// *** Display functions for TALK/STOP button

const displayEnabledTalkStopButton = function () {
  console.log(`***** TALK/stop Button: Enabled *****`);
  recordAnswer.disabled = false;
  recordAnswer.style.background = "green";
  recordAnswer.style.color = "white";
  recordAnswer.innerHTML = "PRESS to TALK";
}
const displayDisabledTalkStopButton = function () {
  console.log(`***** TALK/stop Button: Disabled *****`);
  recordAnswer.disabled = true;
  recordAnswer.style.background = "#C0C0C0";
  recordAnswer.style.color = "#E0E0E0";
  recordAnswer.innerHTML = "PRESS to TALK";
}
const displayEnabledStopTalkButton = function () {
  console.log(`***** talk/STOP Button: Enabled *****`);
  recordAnswer.disabled = false;
  recordAnswer.style.background = "red";
  recordAnswer.style.color = "white";
  recordAnswer.innerHTML = "RECORDING Release to End";
}
// This case shouldn't be needed
const displayDisabledStopTalkButton = function () {
  console.log(`***** talk/STOP Button: Disabled *****`);
  recordAnswer.disabled = true;
  recordAnswer.style.background = "gray";
  recordAnswer.style.color = "lightgray";
  recordAnswer.innerHTML = "RECORDING Release to End";
}
// *** Display functions for NEXT QUESTION button

const displayEnabledNextQuestionButton = function () {
  console.log(`***** NEXT QUESTION Button: Enabled *****`);
  nextQuestion.disabled = false;
  nextQuestion.style.background = "blue";
  nextQuestion.style.color = "white";
  nextQuestion.innerHTML = "NEXT Question";
}
const displayDisabledNextQuestionButton = function () {
  console.log(`***** NEXT QUESTION Button: Disabled *****`);
  nextQuestion.disabled = true;
  nextQuestion.style.background = "gray";
  nextQuestion.style.color = "lightgray";
  nextQuestion.innerHTML = "NEXT Question";
}
// *** Display functions for REPEAT QUESTION button

const displayEnabledRepeatQuestionButton = function () {
  console.log(`***** REPEAT QUESTION Button: Enabled *****`);
  repeatQuestion.disabled = false;
  repeatQuestion.style.background = "blue";
  repeatQuestion.style.color = "white";
  repeatQuestion.innerHTML = "REPEAT Question";
}
const displayDisabledRepeatQuestionButton = function () {
  console.log(`***** REPEAT QUESTION Button: Disabled *****`);
  repeatQuestion.disabled = true;
  repeatQuestion.style.background = "gray";
  repeatQuestion.style.color = "lightgray";
  repeatQuestion.innerHTML = "REPEAT Question";
}
// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = {
    audio: true
  };

  let chunks = [];

  let onSuccess = function (stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    // The prompt has played and TALK/stop is now active as is the REPEAT/next button
    // If Talk/stop is pressed, REPEAT/next is immeditely Disabled
    recordAnswer.onmousedown = function () {
      console.log(`***** TALK/stop Button Handler: Up to Down *****`);
      pressTalkStopButton();

      //mediaRecorder.start();
      console.log("**** recorder starts *****");
      console.log(mediaRecorder.state);

      // enable talk/STOP button. 
      // disable REPEAT QUESTION button & NEXT QUESTION button
    }

    recordAnswer.onmouseup = function () {
      console.log(`***** talk/STOP Button Handler: Down to Up *****`);
      releaseStopTalkButton();

      //mediaRecorder.stop();
      console.log("**** recorder stops ****");
      console.log(mediaRecorder.state);

      // disable TALK/stop button. 
      // enable REPEAT QUESTION button & NEXT QUESTION button

      // recordAnswer.style.color = "";
      // mediaRecorder.requestData();
      // stop.disabled = true;
    }

    nextQuestion.onclick = function () {
      console.log(`***** NEXT QUESTION Button Handler: Up to Down to Up *****`);
      clickNextQuestionButton();

      // disable TALK/stop button & REPEAT QUESTION button & NEXT QUESTION button 

      console.log("***** queue up next prompt and roll it *****");

      // After prompt has played, enable TALK/stop button & REPEAT QUESTION button
    }

    repeatQuestion.onclick = function () {
      console.log(`***** REPEAT QUESTION Button Handler: Up to Down to Up *****`);
      //clickRepeatQuestionButton();

      // disable TALK/stop button & REPEAT QUESTION button & NEXT QUESTION button 

      console.log("***** repeat the current prompt *****");

      // After prompt has played enable TALK/stop & REPEAT QUESTION & NEXT QUESTION
    }
  
    
    // ***** Oscilloscope *****

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

        let sliceWidthCoefficient = 3;
        let sliceWidth = WIDTH * sliceWidthCoefficient / bufferLength;
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

window.onresize = function () {
  canvas.width = mainSection.offsetWidth;
}
startButtonClickHandler();
window.onresize();