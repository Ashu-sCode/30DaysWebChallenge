// script.js
const display = document.getElementById("display");

function appendValue(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    display.value = eval(display.value);
  } catch {
    display.value = "Error";
  }
}

// ✅ Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;
    const keyMap = {
      "/": "÷",
      "*": "×",
      "-": "−",
      "+": "+",
      ".": ".",
      "Enter": "=",
      "=": "=",
      "Backspace": "⌫",
      "Escape": "C",
      "c": "C",
      "C": "C"
    };
  
    const matchedValue = keyMap[key] || key;
  
    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
      if (btn.textContent === matchedValue) {
        btn.classList.add("active");
        setTimeout(() => btn.classList.remove("active"), 150);
      }
    });
  
    if (!isNaN(key) || "+-*/.".includes(key)) {
      appendValue(key);
    } else if (key === "Enter" || key === "=") {
      event.preventDefault();
      calculate();
    } else if (key === "Backspace") {
      deleteLast();
    } else if (key === "Escape" || key.toLowerCase() === "c") {
      clearDisplay();
    }
  });
  