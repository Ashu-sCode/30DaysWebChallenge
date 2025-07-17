const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast is a great skill to learn.",
    "JavaScript makes websites interactive and fun.",
    "Stay focused and practice every day.",
    "Coding improves your problem solving abilities.",
  ];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  const quoteInput = document.getElementById("quoteInput");
  const timer = document.getElementById("timer");
  const wpmDisplay = document.getElementById("wpm");
  const accuracyDisplay = document.getElementById("accuracy");
  const restartBtn = document.getElementById("restartBtn");
  const keyboard = document.getElementById("keyboard");
  
  let currentQuote = "";
  let startTime, interval, countdownTimer;
  let timeLeft = 120;  // 2 minutes countdown
  
  function getRandomQuote() {
    return fetch('https://api.quotable.io/random')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched quote:', data.content);  // Log the response
        return data.content;
      })
      .catch(err => {
        console.error('Error fetching quote:', err);
        return "The quick brown fox jumps over the lazy dog.";  // Fallback quote
      });
  }
  
  
  function displayQuote() {
    getRandomQuote().then(quote => {
      currentQuote = quote;
      quoteDisplay.innerHTML = '';  // Clear the existing quote display
      
      currentQuote.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        quoteDisplay.appendChild(span);
      });
  
      quoteInput.value = '';  // Reset the input field
      clearInterval(interval);  // Stop any active timer
      timer.innerText = '0';  // Reset the timer
      wpmDisplay.innerText = '0';  // Reset WPM
      accuracyDisplay.innerText = '100%';  // Reset accuracy
      startTime = null;  // Reset start time
    }).catch(err => {
      console.error('Error displaying quote:', err);
    });
  }
  
  
  function startCountdown() {
    countdownTimer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);  // Stop timer when time is up
        // Call function to show completion
        finishTest();
      } else {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      }
    }, 1000);
  }
  
  function finishTest() {
    const input = quoteInput.value;
    const correctChars = input.split("").filter((char, index) => char === currentQuote[index]).length;
    const elapsed = 120 - timeLeft;
    const wpm = Math.floor(correctChars / 5 / (elapsed / 60));
    const accuracy = Math.max((correctChars / input.length) * 100, 0).toFixed(0);
  
    showCompletionModal(wpm, accuracy, elapsed);
  }
  
  function showCompletionModal(wpm, accuracy, time) {
    const modal = document.getElementById('completionModal');
    document.getElementById('resultWPM').innerText = `WPM: ${wpm}`;
    document.getElementById('resultAccuracy').innerText = `Accuracy: ${accuracy}%`;
    document.getElementById('resultTime').innerText = `Time: ${time}s`;
  
    // Show confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { x: 0.5, y: 0.5 }
    });
  
    // Play sound
    document.getElementById('completionSound').play();
  
    modal.style.display = 'flex';
  
    // Auto-load next quote after 3 seconds
    setTimeout(() => {
      modal.style.display = 'none';
      displayQuote();
    }, 3000);
  }

  function startTimer() {
    startTime = new Date();
    interval = setInterval(() => {
      const elapsed = Math.floor((new Date() - startTime) / 1000);
      timer.innerText = elapsed;
    }, 1000);
  }
  
  
  quoteInput.addEventListener("input", () => {
    const input = quoteInput.value;
    const quoteSpans = quoteDisplay.querySelectorAll("span");
    let correctChars = 0;
    let mistakes = 0;
  
    if (!startTime) {
      startTime = new Date();
      startTimer();  // Start timer when first input
    }
  
    quoteSpans.forEach((span, index) => {
      const char = input[index];
      if (char == null) {
        span.classList.remove("correct", "incorrect");
      } else if (char === span.innerText) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
        correctChars++;
      } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");
        mistakes++;
      }
    });
  
    const totalTyped = input.length;
    const accuracy = totalTyped
      ? Math.max((correctChars / totalTyped) * 100, 0).toFixed(0)
      : 100;
    accuracyDisplay.innerText = `${accuracy}%`;
  
    const elapsed = Math.floor((new Date() - startTime) / 1000) || 1;
    const wpm = Math.floor(correctChars / 5 / (elapsed / 60));
    wpmDisplay.innerText = wpm;
  
    if (
      input.length === currentQuote.length &&
      correctChars === currentQuote.length
    ) {
      clearInterval(interval);
      finishTest();  // Call to finish the test when the user completes it
    }
  });
  
  restartBtn.addEventListener("click", displayQuote);
  
  // Visual Keyboard
  const fullKeyboard = [
    [
      "Esc",
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11",
      "F12",
      "Del",
    ],
    [
      "`",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "Backspace",
    ],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
    ["Ctrl", "Win", "Alt", "Space", "Alt", "Fn", "Ctrl"],
  ];
  
  function createFullKeyboard() {
    keyboard.innerHTML = "";
    fullKeyboard.forEach((rowKeys) => {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("keyboard-row");
  
      rowKeys.forEach((key) => {
        const keyDiv = document.createElement("div");
        keyDiv.classList.add("key");
  
        if (
          [
            "Backspace",
            "Tab",
            "CapsLock",
            "Enter",
            "Shift",
            "Ctrl",
            "Alt",
            "Space",
          ].includes(key)
        ) {
          keyDiv.classList.add(key === "Space" ? "extra-wide" : "wide");
        }
  
        keyDiv.innerText = key;
        keyDiv.id = `key-${key.toUpperCase()}`;
        rowDiv.appendChild(keyDiv);
      });
  
      keyboard.appendChild(rowDiv);
    });
  }
  
  // Highlight keys
  document.addEventListener("keydown", (e) => {
    let key = e.key;
  
    // Handle special keys
    if (key === " ") key = "Space";
    if (key === "Control") key = "Ctrl";
    if (key === "Meta") key = "Win";
    if (key === "AltGraph") key = "Alt";
    if (key === "OS") key = "Win";
  
    const keyId = `key-${key.toUpperCase()}`;
    const keyDiv = document.getElementById(keyId);
    if (keyDiv) keyDiv.classList.add("active");
  });
  
  document.addEventListener("keyup", (e) => {
    let key = e.key;
    if (key === " ") key = "Space";
    if (key === "Control") key = "Ctrl";
    if (key === "Meta") key = "Win";
    if (key === "AltGraph") key = "Alt";
    if (key === "OS") key = "Win";
  
    const keyId = `key-${key.toUpperCase()}`;
    const keyDiv = document.getElementById(keyId);
    if (keyDiv) keyDiv.classList.remove("active");
  });
  
  // Load
  createFullKeyboard();
  displayQuote();
  