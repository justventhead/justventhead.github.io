let deleteTimer = null;
let mediaRecorder;
let recordedChunks = [];
let stream;

// Function to enable or disable radio buttons
function setTimerControls(enabled) {
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((button) => {
    button.disabled = !enabled;
  });
}

// Function to enable journal entry when a timer is selected
function enableJournalEntry() {
  const timerForm = document.getElementById("timer-form-journal");
  timerForm.addEventListener("change", function () {
    const selectedDuration = document.querySelector(
      'input[name="timer"]:checked'
    ).value;
    document.getElementById("journal-entry").removeAttribute("disabled");
    document.getElementById("journal-entry").focus();

    setTimerControls(false); // Disable timer controls

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
      setTimerControls(true); // Re-enable timer controls after timer ends
    }, selectedDuration * 1000);
  });
}

// Setup video recording with selected timer duration
function setupRecording() {
  const timerForm = document.getElementById("timer-form-video");
  timerForm.addEventListener("change", function () {
    const selectedDuration = document.querySelector(
      'input[name="timer"]:checked'
    ).value;
    document.getElementById("start-recording-button").onclick = () => {
      startRecording(selectedDuration);
    };
  });
}

// Start recording video with a timer to stop automatically
function startRecording(duration) {
  recordedChunks = [];
  mediaRecorder.start();
  document.getElementById("start-recording-button").style.display = "none";
  document.getElementById("stop-recording-button").style.display = "inline";

  setTimeout(() => {
    if (mediaRecorder.state === "recording") {
      stopRecording();
    }
  }, duration * 1000);
}

// Stop video recording and handle UI changes
function stopRecording() {
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  document.getElementById("start-recording-button").style.display = "inline";
  document.getElementById("stop-recording-button").style.display = "none";
  setTimerControls(true); // Re-enable timer controls after recording stops
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

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("enter-button").addEventListener("click", enterApp);
  enableJournalEntry();
  setupRecording();
});

function enterApp() {
  document.getElementById("landing-page").style.display = "none";
  document.querySelector(".container").style.display = "block";
}

document
  .getElementById("journal-view-button")
  .addEventListener("click", () => switchView("journal-view"));
document
  .getElementById("video-view-button")
  .addEventListener("click", () => switchView("video-view"));

document.addEventListener("DOMContentLoaded", function () {
  enableJournalEntry();
  setupRecording();
});
