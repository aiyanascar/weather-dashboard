const apiKey = 'f51c44fcc8c859ef9d2757881369edc2';
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const searchHistoryContainer = document.getElementById('search-history');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast-cards');

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getCityCoordinates(city);
    }
});

function getCityCoordinates(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeatherData(city, lat, lon);
                addToSearchHistory(city);
            } else {
                alert('City not found');
            }
        });
}

function getWeatherData(city, lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(city, data.list[0]);
            displayForecast(data.list);
        });
}

function displayCurrentWeather(city, data) {
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const weatherHTML = `
        <h2>${city} (${date}) <img src="${weatherIcon}" alt="${data.weather[0].description}"></h2>
        <p>Temp: ${data.main.temp} °F</p>
        <p>Wind: ${data.wind.speed} MPH</p>
        <p>Humidity: ${data.main.humidity} %</p>
    `;
    currentWeatherContainer.innerHTML = weatherHTML;
}

function displayForecast(forecast) {
    forecastContainer.innerHTML = '';
    for (let i = 0; i < forecast.length; i += 8) {
        const data = forecast[i];
        const date = new Date(data.dt * 1000).toLocaleDateString();
        const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        const cardHTML = `
            <div class="forecast-card">
                <h4>${date} <img src="${weatherIcon}" alt="${data.weather[0].description}"></h4>
                <p>Temp: ${data.main.temp} °F</p>
                <p>Wind: ${data.wind.speed} MPH</p>
                <p>Humidity: ${data.main.humidity} %</p>
            </div>
        `;
        forecastContainer.innerHTML += cardHTML;
    }
}

function addToSearchHistory(city) {
    const historyButton = document.createElement('button');
    historyButton.textContent = city;
    historyButton.addEventListener('click', () => {
        getCityCoordinates(city);
    });
    searchHistoryContainer.appendChild(historyButton);
    updateLocalStorage(city);
}

function updateLocalStorage(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(city => {
        addToSearchHistory(city);
    });
}

loadSearchHistory();
