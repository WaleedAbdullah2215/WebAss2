const WEATHER_API_KEY = 'f01a966415e87ff43773e609cf7dcba5';
const GEMINI_API_KEY = 'AIzaSyDRdDeuU8FIly1wHoh2aWnnlJ-UXjm0atM';

const searchBar = document.getElementById('searchBar');
const weatherWidget = document.querySelector('.weather-widget');
const temperatureChart = document.getElementById('temperatureChart');
const conditionsChart = document.getElementById('conditionsChart');
const forecastChart = document.getElementById('forecastChart');

let isMetric = true;

searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather(searchBar.value);
    }
});

document.getElementById('getWeatherBtn').addEventListener('click', () => {
    getWeather(searchBar.value);
});

document.getElementById('toggleUnitBtn').addEventListener('click', () => {
    isMetric = !isMetric;
    document.getElementById('toggleUnitBtn').className = `nav-btn ${isMetric ? 'celsius' : 'fahrenheit'}`;
    if (searchBar.value) {
        getWeather(searchBar.value);
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=${isMetric ? 'metric' : 'imperial'}`);
        const data = await response.json();
        updateWeatherWidget(data);
        getForecast(city);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherWidget.innerHTML = '<p>Error fetching weather data. Please try again.</p>';
    }
}

function updateWeatherWidget(data) {
    const weatherDescription = data.weather[0].description;
    const weatherIcon = data.weather[0].icon;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    weatherWidget.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${temperature}°${isMetric ? 'C' : 'F'}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} ${isMetric ? 'm/s' : 'mph'}</p>
        <p>Weather: ${weatherDescription}</p>
        <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
    `;

    const weatherBackgrounds = {
        'sunny': 'sunny.jpg',
        'cloudy': 'cloudy.jpg',
        'rainy': 'rainy.jpg',
        'snowy': 'snowy.jpg',
        'windy': 'windy.jpg',
    };

    const weatherBackground = weatherBackgrounds[weatherDescription.toLowerCase()] || 'default.jpg';
    weatherWidget.style.backgroundImage = `url(${weatherBackground})`;
}

async function getForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=${isMetric ? 'metric' : 'imperial'}`);
        const data = await response.json();
        updateCharts(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

function updateCharts(data) {
    updateTemperatureChart(data);
    updateConditionsChart(data);
    updateForecastChart(data);
}

function updateTemperatureChart(data) {
    const ctx = temperatureChart.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.list.slice(0, 5).map(item => new Date(item.dt * 1000).toLocaleDateString()),
            datasets: [{
                label: `Temperature (${isMetric ? '°C' : '°F'})`,
                data: data.list.slice(0, 5).map(item => item.main.temp),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            animation: {
                delay: 500
            }
        }
    });
}

function updateConditionsChart(data) {
    const conditions = data.list.slice(0, 5).map(item => item.weather[0].main);
    const conditionCounts = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    const ctx = conditionsChart.getContext ('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(conditionCounts),
            datasets: [{
                data: Object.values(conditionCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Weather Conditions'
                }
            },
            animation: {
                delay: 500
            }
        }
    });
}

function updateForecastChart(data) {
    const ctx = forecastChart.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.list.slice(0, 5).map(item => new Date(item.dt * 1000).toLocaleDateString()),
            datasets: [{
                label: `Temperature (${isMetric ? '°C' : '°F'})`,
                data: data.list.slice(0, 5).map(item => item.main.temp),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Temperature Forecast'
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutBounce'
            }
        }
    });
}

document.getElementById('toggleUnitBtn').className = `nav-btn celsius`;