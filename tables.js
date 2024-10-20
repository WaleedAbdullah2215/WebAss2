const WEATHER_API_KEY = 'f01a966415e87ff43773e609cf7dcba5';
const GEMINI_API_KEY = 'AIzaSyDRdDeuU8FIly1wHoh2aWnnlJ-UXjm0atM';

const searchBar = document.getElementById('searchBar');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const toggleUnitBtn = document.getElementById('toggleUnitBtn');
const forecastTable = document.getElementById('forecastTable');
const pagination = document.getElementById('pagination');
const chatInput = document.getElementById('chatInput');
const chatOutput = document.getElementById('chatOutput');
const filterSelect = document.getElementById('filterSelect');

let forecastData = [];
let filteredData = [];
const itemsPerPage = 10;
let currentPage = 1;
let isMetric = true;

searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getForecast(searchBar.value);
    }
});

getWeatherBtn.addEventListener('click', () => {
    getForecast(searchBar.value);
});

toggleUnitBtn.addEventListener('click', () => {
    isMetric = !isMetric;
    toggleUnitBtn.className = `nav-btn ${isMetric ? 'celsius' : 'fahrenheit'}`;
    if (searchBar.value) {
        getForecast(searchBar.value);
    }
});

filterSelect.addEventListener('change', () => {
    applyFilter();
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleChatInput(chatInput.value);
    }
});

function applyFilter() {
    const filterValue = filterSelect.value;

    switch (filterValue) {
        case 'tempAsc':
            filteredData = [...forecastData].sort((a, b) => a.main.temp - b.main.temp);
            break;

        case 'tempDesc':
            filteredData = [...forecastData].sort((a, b) => b.main.temp - a.main.temp);
            break;

        case 'rain':
            filteredData = forecastData.filter(item =>
                item.weather[0].description.toLowerCase().includes('rain'));
            break;

        case 'highest':
            const highestTemp = forecastData.reduce((max, item) =>
                item.main.temp > max.main.temp ? item : max, forecastData[0]);
            filteredData = [highestTemp];
            break;

        default:
            filteredData = [...forecastData];
    }

    currentPage = 1;
    updateTable();
}

async function getForecast(city) {
    if (!city.trim()) return;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=${isMetric ? 'metric' : 'imperial'}`
        );
        const data = await response.json();
        forecastData = data.list;
        filteredData = [...forecastData];
        applyFilter();
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

function updateTable() {
    const tableBody = forecastTable.querySelector('tbody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    const tempUnit = isMetric ? '°C' : '°F';
    const speedUnit = isMetric ? 'm/s' : 'mph';

    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
            <td>${Math.round(item.main.temp)}${tempUnit}</td>
            <td>${item.main.humidity}%</td>
            <td>${item.wind.speed} ${speedUnit}</td>
            <td>${item.weather[0].description}</td>
        `;
        tableBody.appendChild(row);
    });

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.toggle('active', i === currentPage);
        button.addEventListener('click', () => {
            currentPage = i;
            updateTable();
        });
        pagination.appendChild(button);
    }
}

async function handleChatInput(input) {
    if (!input.trim()) return;

    chatOutput.innerHTML += `<p><strong>You:</strong> ${input}</p>`;

    const weatherRegex = /weather.*in\s+([a-zA-Z\s]+)/i;
    const match = input.match(weatherRegex);

    if (match) {
        const city = match[1].trim();
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=${isMetric ? 'metric' : 'imperial'}`
            );
            const data = await response.json();

            const tempUnit = isMetric ? '°C' : '°F';
            const speedUnit = isMetric ? 'm/s' : 'mph';

            const weatherResponse = `The current weather in ${city} is ${data.weather[0].description} with a temperature of ${Math.round(data.main.temp)}${tempUnit}. The humidity is ${data.main.humidity}% and wind speed is ${data.wind.speed} ${speedUnit}.`;

            chatOutput.innerHTML += `<p><strong>Assistant:</strong> ${weatherResponse}</p>`;
            
            getForecast(city);
        } catch (error) {
            chatOutput.innerHTML += `<p><strong>Assistant:</strong> Sorry, I couldn't fetch the weather information for ${city}. Please try again.</p>`;
        }
    } else 
    {
        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GEMINI_API_KEY}`
                },
                body: JSON.stringify({
                    contents: [{ text: input }]
                })
            });
            const data = await response.json();
            chatOutput.innerHTML += `<p><strong>Assistant:</strong> ${data.candidates[0].content.text}</p>`;
        } catch (error) {
            chatOutput.innerHTML += `<p><strong>Assistant:</strong> I'm sorry, I couldn't process your request at the moment.</p>`;
        }
    }
    
    chatOutput.scrollTop = chatOutput.scrollHeight;
    chatInput.value = '';
}

getForecast('London');