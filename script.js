async function fetchWeather() {
    const location = document.getElementById('location-input').value || 'Colombo';
    const apiKey = 'e561ccfd8a54d22e40f88445a463cae0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        document.getElementById('location-name').innerText = `${data.city.name}, ${data.city.country}`;

        const timezoneOffset = data.city.timezone;
        updateClock(timezoneOffset);

        const temperature = Math.round(data.list[0].main.temp);
        const description = data.list[0].weather[0].description;
        document.getElementById('temperature').innerText = `${temperature}°C`;
        document.getElementById('weather-condition').innerHTML = `<h2>${description.charAt(0).toUpperCase() + description.slice(1)}</h2>`;

        document.getElementById('humidity').innerText = `${data.list[0].main.humidity}% Humidity`;
        document.getElementById('wind').innerText = `${data.list[0].wind.speed} km/h Wind`;

        document.getElementById('map').innerHTML = `
            <iframe 
                width="100%" 
                height="250" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=${data.city.coord.lon - 0.05}%2C${data.city.coord.lat - 0.05}%2C${data.city.coord.lon + 0.05}%2C${data.city.coord.lat + 0.05}&amp;layer=mapnik" 
                style="border:0;" 
                allowfullscreen 
                loading="lazy">
            </iframe>`;

        const forecastCards = document.getElementById('forecast-cards');
        forecastCards.innerHTML = '';

        for (let i = 0; i < 7; i++) {
            const dayForecast = data.list[i * 8];
            const dayName = new Date(dayForecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
            const dayTemp = Math.round(dayForecast.main.temp);
            const weatherIcon = dayForecast.weather[0].icon;
            const dayDescription = dayForecast.weather[0].description;

            const card = document.createElement('div');
            card.classList.add('day');
            card.innerHTML = `
                <div class="day-name">${dayName}</div>
                <div class="day-icon"><img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${dayDescription}"></div>
                <div class="day-temp">${dayTemp}°C</div>
                <div class="day-desc">${dayDescription}</div>
            `;
            forecastCards.appendChild(card);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateClock(timezoneOffset = 0) {
    function update() {
        const now = new Date();
        const localTime = new Date(now.getTime() + timezoneOffset * 1000);
        let hours = localTime.getUTCHours();
        const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(localTime.getUTCSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        document.getElementById('time-display').innerHTML =
            `${hours}:${minutes}:${seconds} <span>${ampm}</span>`;
    }
    setInterval(update, 1000);
    update();
}

fetchWeather(); 