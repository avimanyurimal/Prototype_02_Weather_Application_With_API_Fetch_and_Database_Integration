const pastDataButton = document.querySelector("#past-data-button");
const pastDataContainer = document.querySelector('.past-data');

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const errorMessage = document.getElementById("error-message");
const resultBox = document.querySelector(".result-box");

const cityName = document.getElementById("city-name");
const countryName = document.getElementById("country-name");
const day = document.getElementById("day");
const time = document.getElementById("time");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const wind = document.getElementById("wind");
const description = document.getElementById("description");
const rainfall = document.getElementById("rainfall");

const defaultCity = "Rochdale";
let currentCity = defaultCity; // Variable to store the current city name

// Function to display weather data
function displayWeatherData(data) {
    cityName.textContent = data.name;
    countryName.textContent = data.sys.country;
    day.textContent = new Date().toLocaleDateString("en-US", { weekday: 'long' });
    time.textContent = new Date().toLocaleTimeString("en-US");
    weatherIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    temperature.textContent = `${data.main.temp}°C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
    wind.textContent = `Wind: ${data.wind.speed} m/s`;
    description.textContent = data.weather[0].description;
    rainfall.textContent = `Rainfall: ${data.rain ? data.rain["1h"] || "0" : "0"} mm`;
    resultBox.style.display = "block";
    errorMessage.textContent = "";
}

function fetchAndDisplayWeather(city) {
    currentCity = city; // Update the current city
    const localStorageData = JSON.parse(localStorage.getItem(city));

    if (localStorageData) {
        displayWeatherData(localStorageData);
    } else {
        fetchWeatherData(city)
            .then(data => {
                displayWeatherData(data);
                localStorage.setItem(city, JSON.stringify(data));
                saveWeatherDataToDatabase(city, data)
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                errorMessage.textContent = error.message;
                resultBox.style.display = "none";
            });
    }
}

// Function to load default city weather data on page load
function loadDefaultCityWeather() {
    fetchAndDisplayWeather(defaultCity);
}

// Add event listener for form submission
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city.length === 0) {
        errorMessage.textContent = "Please enter a city name";
        resultBox.style.display = "none";
    } else {
        errorMessage.textContent = "";
        resultBox.style.display = "none";
        fetchAndDisplayWeather(city);
    }
});

// Saving weather data to the local database
function saveWeatherDataToDatabase(city, data) {
    return fetch("AvimanyuRimal_2358196.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ city, data })
    })
        .then(response => response.text())
        .catch(error => {
            throw new Error("Error saving data to the database.");
        });
}

// Fetch weather data from the OpenWeatherMap API
function fetchWeatherData(city) {
    const apiKey = "a71e3962f457fb2a5b1fb49bc530cf6c";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    return fetch(apiUrl)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("City not found");
            }
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            throw new Error("Wrong Input Or Error Retrieving Weather Data! Kindly Please Try Again");
        });
}

// Event listener for "Show Past Data" button
pastDataButton.addEventListener("click", () => {
    pastDataContainer.innerHTML = "Loading past data...";

    fetch(`past.php?city=${currentCity}`)
        .then(response => response.text())
        .then(data => {
            pastDataContainer.innerHTML = data;
        })
        .catch(error => {
            pastDataContainer.innerHTML = "Error loading past data.";
        });
});

// Load default city weather data and past data on page load
window.addEventListener("load", () => {
    loadDefaultCityWeather();
    // You might want to add more initialization or event listeners here
});
