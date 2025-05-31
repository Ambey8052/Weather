async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "9d0e52c6122a0e127d041e61f753d0e7"; // Replace with your actual API key
  const weatherResult = document.getElementById("weatherResult");
  const errorElem = document.getElementById("error");

  if (!city) {
    errorElem.textContent = "Please enter a city name.";
    weatherResult.classList.add("hidden");
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      errorElem.textContent = "City not found. Please try again.";
      weatherResult.classList.add("hidden");
      return;
    }

    errorElem.textContent = "";
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("temp").textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherResult.classList.remove("hidden");
  } catch (error) {
    errorElem.textContent = "Error fetching weather data.";
    weatherResult.classList.add("hidden");
  }
}
