document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "b7ab7e1a9fe749db968104920251104";

  // Shared render function
  function renderWeather(data) {
    const resultDiv = document.getElementById("result");
  
    const location = data.location.name + ", " + data.location.country;
    const current = data.current;
    const forecast = data.forecast.forecastday;
  
    resultDiv.innerHTML = `
      <div class="current-weather">
        <h3>${location}</h3>
        <img src="https:${current.condition.icon}" alt="${current.condition.text}" />
        <p><strong>${current.temp_c}°C</strong> – ${current.condition.text}</p>
        <p>Feels like: ${current.feelslike_c}°C</p>
        <p>Humidity: ${current.humidity}% | Wind: ${current.wind_kph} km/h</p>
      </div>
  
      <div class="forecast-wrapper">
        
  
        <div class="forecast-carousel" id="forecastCarousel">
          ${forecast
            .map(
              (day) => `
            <div class="forecast-card" data-date="${day.date}">
              <p><strong>${day.date}</strong></p>
              <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
              <p>${day.day.avgtemp_c}°C</p>
              <p>${day.day.condition.text}</p>
            </div>
          `
            )
            .join("")}
        </div>
  
      
      </div>
    `;

   
  
    attachHourlyPopup(data); // ✅ This is the missing part
  }
  

  // Show hourly popup
  function attachHourlyPopup(data) {
    setTimeout(() => {
      document.querySelectorAll(".forecast-card").forEach((card) => {
        card.addEventListener("click", () => {
          const selectedDate = card.getAttribute("data-date");
          const dayData = data.forecast.forecastday.find((d) => d.date === selectedDate);
          if (!dayData) return;
  
          const hourlyHTML = dayData.hour
            .map(
              (hour) => `
              <div class="hour-card">
                <p><strong>${hour.time.split(" ")[1]}</strong></p>
                <img src="https:${hour.condition.icon}" />
                <p>${hour.condition.text}</p>
                <p>🌡️ ${hour.temp_c}°C</p>
                <p>💨 ${hour.wind_kph} km/h</p>
              </div>
            `
            )
            .join("");
  
          const popup = document.createElement("div");
          popup.className = "hourly-popup";
          popup.innerHTML = `
            <div class="hourly-header">
              <h3>Hourly Forecast: ${new Date(selectedDate).toDateString()}</h3>
              <button class="close-popup">✖</button>
            </div>
            <div class="hourly-scroll">${hourlyHTML}</div>
          `;
          document.body.appendChild(popup);
  
          popup.querySelector(".close-popup").addEventListener("click", () => {
            popup.remove();
          });
        });
      });
    }, 0);
  }
  

  // City-based weather
  window.getWeather = async function () {
    const city = document.getElementById("city").value.trim();
    const resultDiv = document.getElementById("result");
    const loader = document.getElementById("loader");

    if (city === "") {
      resultDiv.style.display = "block";
      resultDiv.innerHTML = "⚠️ Please enter a city name!";
      return;
    }

    resultDiv.style.display = "none";
    loader.style.display = "block";

    try {
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=7`);
      const data = await res.json();

      loader.style.display = "none";
      resultDiv.style.display = "block";

      if (data.error) {
        resultDiv.innerHTML = "❌ City not found!";
        return;
      }

      renderWeather(data);
    } catch (error) {
      loader.style.display = "none";
      resultDiv.style.display = "block";
      resultDiv.innerHTML = "⚠️ Failed to get weather!";
      console.error("Fetch error:", error);
    }
  };

  // Auto-location weather
  window.getLocationWeather = async function () {
    const resultDiv = document.getElementById("result");
    const loader = document.getElementById("loader");

    resultDiv.style.display = "none";
    loader.style.display = "block";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;

        try {
          const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`);
          const data = await res.json();

          loader.style.display = "none";
          resultDiv.style.display = "block";

          if (data.error) {
            resultDiv.innerHTML = "❌ Location not found!";
            return;
          }

          renderWeather(data);
        } catch (error) {
          loader.style.display = "none";
          resultDiv.style.display = "block";
          resultDiv.innerHTML = "⚠️ Failed to get weather!";
          console.error(error);
        }
      });
    } else {
      loader.style.display = "none";
      resultDiv.style.display = "block";
      resultDiv.innerHTML = "🚫 Geolocation not supported by this browser.";
    }
  };

  // Timezone-based weather (on load)
  window.addEventListener("load", async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneToCapital = {
      "Asia/Kolkata": "New Delhi",
      "America/New_York": "Washington",
      "Europe/London": "London",
      "Asia/Tokyo": "Tokyo",
      "Europe/Berlin": "Berlin",
      "Asia/Dubai": "Abu Dhabi",
      "Asia/Bangkok": "Bangkok",
      "Asia/Singapore": "Singapore",
      "Australia/Sydney": "Canberra",
      "Africa/Cairo": "Cairo",
      "America/Los_Angeles": "Los Angeles",
      "Asia/Shanghai": "Beijing",
      "Europe/Moscow": "Moscow",
      "Asia/Jakarta": "Jakarta",
    };

    const capital = timezoneToCapital[timezone] || "London";
    const resultDiv = document.getElementById("result");
    const loader = document.getElementById("loader");

    resultDiv.style.display = "none";
    loader.style.display = "block";

    try {
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(capital)}&days=7`);
      const data = await res.json();

      loader.style.display = "none";
      resultDiv.style.display = "block";

      if (data.error) {
        resultDiv.innerHTML = "❌ Could not load weather info.";
        return;
      }

      renderWeather(data);
    } catch (error) {
      loader.style.display = "none";
      resultDiv.style.display = "block";
      resultDiv.innerHTML = "⚠️ Something went wrong!";
      console.error(error);
    }
  });
});

// Theme Switcher 
const toggleButton = document.getElementById("themeToggle");
const icon = document.getElementById("themeIcon");

toggleButton.addEventListener("click", () => {
  // Smoothly fade out the icon
  icon.style.opacity = 0;
  icon.style.transform = "rotate(180deg)";

  setTimeout(() => {
    // Toggle dark mode
    document.body.classList.toggle("dark");

    // Change icon based on theme
    const isDark = document.body.classList.contains("dark");
    icon.textContent = isDark ? "☀️" : "🌙";

    // Fade in new icon
    icon.style.opacity = 1;
    icon.style.transform = "rotate(360deg)";
  }, 300); // delay matches CSS transition duration
});


// Scroll 

