let deleteTimer = null;

// Function to start timer when a radio button is selected
function startTimerOnChange() {
  const timerForm = document.getElementById("timer-form");
  const timerInputs = timerForm.elements["timer"];

  // Add change event listener to each radio button
  timerInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const timerDuration = parseInt(this.value, 10);

      // Clear existing timer if any
      if (deleteTimer) {
        clearTimeout(deleteTimer);
      }

      document.getElementById("journal-entry").removeAttribute("disabled");
      document.getElementById("journal-entry").focus();

      // Start timer to delete text
      deleteTimer = setTimeout(() => {
        // Replace textarea content with a positive quote
        document.getElementById("journal-entry").value =
          "Happiness is a choice. Choose it every day!";

        // Enable button to start another session
        document
          .getElementById("start-session-button")
          .removeAttribute("disabled");
      }, timerDuration * 1000); // Convert seconds to milliseconds
    });
  });
}

// Function to start another session
function startAnotherSession() {
  // Clear textarea and enable for typing
  document.getElementById("journal-entry").value = "";
  document.getElementById("journal-entry").removeAttribute("disabled");
  document.getElementById("journal-entry").focus();

  // Disable the start session button again
  document
    .getElementById("start-session-button")
    .setAttribute("disabled", "true");
}

// Call startTimerOnChange function when the page loads
document.addEventListener("DOMContentLoaded", startTimerOnChange);
