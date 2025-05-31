const apiKey = "9d0e52c6122a0e127d041e61f753d0e7"; // Replace with your real API key

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name.");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    if (data.cod !== 200) throw new Error(data.message);

    document.getElementById("weatherResult").innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>${data.weather[0].main} - ${data.weather[0].description}</p>
      <p>🌡 Temp: ${data.main.temp} °C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬 Wind: ${data.wind.speed} m/s</p>
    `;
    document.getElementById("weatherResult").classList.remove("hidden");

    setBackground(data.weather[0].main);
    saveRecentCity(data.name);
    await getForecast(city);
  } catch (err) {
    alert("City not found. Please try again.");
    document.getElementById("weatherResult").classList.add("hidden");
    document.getElementById("forecast").classList.add("hidden");
  }
}

async function getForecast(city) {
  const forecastContainer = document.getElementById("forecast");
  const forecastCards = document.getElementById("forecastCards");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();

    forecastCards.innerHTML = "";
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    daily.forEach(day => {
      const date = new Date(day.dt_txt).toDateString();
      const icon = day.weather[0].icon;
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].description;

      forecastCards.innerHTML += `
        <div class="forecast-day">
          <div>${date.split(' ')[0]}</div>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png"/>
          <div>${temp}°C</div>
          <small>${desc}</small>
        </div>
      `;
    });

    forecastContainer.classList.remove("hidden");
  } catch (error) {
    forecastContainer.classList.add("hidden");
  }
}

function getLocationWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        document.getElementById("cityInput").value = data.name;
        getWeather();
      } catch (err) {
        alert("Failed to get location weather.");
      }
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function setBackground(type) {
  type = type.toLowerCase();
  switch (type) {
    case "clear":
      document.body.style.background = "linear-gradient(to right, #56ccf2, #2f80ed)";
      break;
    case "clouds":
      document.body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
      break;
    case "rain":
      document.body.style.background = "linear-gradient(to right, #00c6ff, #0072ff)";
      break;
    case "snow":
      document.body.style.background = "linear-gradient(to right, #e0eafc, #cfdef3)";
      break;
    case "thunderstorm":
      document.body.style.background = "linear-gradient(to right, #373B44, #4286f4)";
      break;
    default:
      document.body.style.background = "linear-gradient(to right, #74ebd5, #9face6)";
  }
}

function saveRecentCity(city) {
  let history = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 5) history.pop();
    localStorage.setItem("recentCities", JSON.stringify(history));
    renderRecentCities();
  }
}

function renderRecentCities() {
  let history = JSON.parse(localStorage.getItem("recentCities")) || [];
  const container = document.getElementById("recentSearches");
  container.innerHTML = "<h4>Recent Searches:</h4>";
  history.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.onclick = () => {
      document.getElementById("cityInput").value = city;
      getWeather();
    };
    container.appendChild(btn);
  });
}

// Call on load
renderRecentCities();
