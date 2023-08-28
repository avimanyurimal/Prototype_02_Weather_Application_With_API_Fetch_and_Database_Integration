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

// Function to fetch weather data and display
function fetchAndDisplayWeather(city) {
    fetchWeatherData(city)
        .then(data => {
            displayWeatherData(data);
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
    const searchedCity = cityInput.value.trim();
    if (searchedCity || defaultCity) {
        const cityToShow = searchedCity || defaultCity;
        fetchAndDisplayPastData(cityToShow);
    } else {
        errorMessage.textContent = "Please enter a city name to retrieve past data.";
    }
});

// Load default city weather data and past data on page load
window.addEventListener("load", () => {
    loadDefaultCityWeather();
});

// Function to fetch and display past data
function fetchAndDisplayPastData(city) {
    let pastDataContainer = document.querySelector(".past-data");
    pastDataContainer.innerHTML = ""; // Clear previous data

    if (city === "") {
        city = defaultCity;
    }

    fetch(`past.php?city=${city}`)
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date();
            const sixDaysAgo = new Date(currentDate);
            sixDaysAgo.setDate(currentDate.getDate() - 6);

            let filteredData = [];
            for (let i = 0; i < 6; i++) {
                const targetDate = new Date(sixDaysAgo);
                targetDate.setDate(sixDaysAgo.getDate() + i);
                const matchingEntry = data.find(entry => isSameDate(new Date(entry.date), targetDate));

                if (matchingEntry) {
                    filteredData.push(matchingEntry);
                } else {
                    filteredData.push({
                        city: city,
                        temperature: "N/A",
                        humidity: "N/A",
                        pressure: "N/A",
                        wind: "N/A",
                        description: "No data available",
                        date: targetDate.toISOString()
                    });
                }
            }

            if (filteredData.length === 0) {
                pastDataContainer.innerHTML = `No past weather data available for ${city} in the last 7 days.`;
            } else {
                filteredData.forEach(entry => {
                    const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    });

                    pastDataContainer.innerHTML += `
              <div class='past-weather-box'>
                <h3>Past Weather Data for ${entry.city} on ${formattedDate}</h3>
                <p>Temperature: ${entry.temperature} &#8451;</p>
                <p>Humidity: ${entry.humidity}%</p>
                <p>Pressure: ${entry.pressure} hPa</p>
                <p>Wind Speed: ${entry.wind} m/s</p>
                <p>Description: ${entry.description}</p>
              </div>
            `;
                });
            }
        })
        .catch(error => {
            pastDataContainer.innerHTML = `Error loading past data for ${city}.`;
        });
}

// Function to check if two dates are the same
function isSameDate(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}