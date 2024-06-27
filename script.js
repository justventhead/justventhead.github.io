let deleteTimer = null;
let mediaRecorder;
let recordedChunks = [];
let stream;
let isRecording = false; // Flag to track recording state

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("enter-button").addEventListener("click", enterApp);
  document
    .getElementById("journal-view-button")
    .addEventListener("click", () => switchView("journal-view"));
  document
    .getElementById("video-view-button")
    .addEventListener("click", () => switchView("video-view"));
  enableJournalEntry();
  setupRecording();
});

function enterApp() {
  document.getElementById("landing-page").style.display = "none";
  document.querySelector(".container").style.display = "block";
}

function switchView(viewToShow) {
  document.querySelectorAll(".view").forEach((view) => {
    if (view.classList.contains("active")) {
      deactivateView(view.id);
    }
    view.classList.remove("active");
  });
  document.getElementById(viewToShow).classList.add("active");
  activateView(viewToShow);
}

function deactivateView(viewId) {
  if (viewId === "journal-view") {
    if (deleteTimer) {
      clearTimeout(deleteTimer);
      document.getElementById("journal-entry").setAttribute("disabled", "true");
      document
        .getElementById("start-session-button-journal")
        .setAttribute("disabled", "true");
    }
  } else if (viewId === "video-view") {
    if (isRecording) {
      stopRecording();
    }
    const video = document.getElementById("preview-video");
    video.pause();
    if (video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  }
}

function activateView(viewId) {
  if (viewId === "video-view") {
    setupVideoStream();
  }
}

function setupVideoStream() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((localStream) => {
      stream = localStream;
      const video = document.getElementById("preview-video");
      video.srcObject = stream;
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = playReversedVideo;
    })
    .catch((error) => console.error("Error accessing webcam: ", error));
}

function setTimerControls(enabled) {
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((button) => {
    button.disabled = !enabled;
  });
}

function enableJournalEntry() {
  const timerForm = document.getElementById("timer-form-journal");
  timerForm.addEventListener("change", function () {
    const selectedDuration = document.querySelector(
      'input[name="timer"]:checked'
    ).value;
    document.getElementById("journal-entry").removeAttribute("disabled");
    document.getElementById("journal-entry").focus();

    setTimerControls(false);

    if (deleteTimer) {
      clearTimeout(deleteTimer);
    }
    deleteTimer = setTimeout(() => {
      document.getElementById("journal-entry").setAttribute("disabled", "true");
      document.getElementById("journal-entry").value =
        "Happiness is a choice. Choose it every day!";
      document
        .getElementById("start-session-button-journal")
        .removeAttribute("disabled");
      setTimerControls(true);
    }, selectedDuration * 1000);
  });
}

function startRecording(duration) {
  recordedChunks = [];
  mediaRecorder.start();
  isRecording = true;
  document.getElementById("start-recording-button").style.display = "none";
  document.getElementById("stop-recording-button").style.display = "inline";

  setTimeout(() => {
    if (mediaRecorder.state === "recording") {
      stopRecording();
    }
  }, duration * 1000);
}

function stopRecording() {
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  isRecording = false;
  document.getElementById("start-recording-button").style.display = "inline";
  document.getElementById("stop-recording-button").style.display = "none";
  setTimerControls(true);
}

function playReversedVideo() {
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const videoURL = URL.createObjectURL(blob);
  const video = document.getElementById("preview-video");
  video.src = videoURL;

  video.onloadedmetadata = () => {
    video.currentTime = video.duration;
    video.playbackRate = -1;
    video.play();

    video.onended = () => {
      video.pause();
      URL.revokeObjectURL(videoURL);
      video.srcObject = stream;
      video.play();
    };
  };
}
