const form = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const status = document.querySelector('#status');
const content = document.querySelector('#weather-content');
const weatherCodes = { 0: ['Clear sky', '☀'], 1: ['Mostly clear', '🌤'], 2: ['Partly cloudy', '⛅'], 3: ['Overcast', '☁'], 45: ['Foggy', '🌫'], 48: ['Icy fog', '🌫'], 51: ['Light drizzle', '🌦'], 53: ['Drizzle', '🌦'], 55: ['Heavy drizzle', '🌧'], 61: ['Light rain', '🌦'], 63: ['Rain', '🌧'], 65: ['Heavy rain', '🌧'], 71: ['Light snow', '🌨'], 73: ['Snow', '🌨'], 75: ['Heavy snow', '❄'], 80: ['Rain showers', '🌦'], 81: ['Rain showers', '🌧'], 82: ['Heavy showers', '⛈'], 95: ['Thunderstorm', '⛈'] };

const condition = code => weatherCodes[code] || ['Unknown conditions', '🌡'];
const formatDay = date => new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(`${date}T12:00:00`));
function setStatus(message, isError = false) { status.textContent = message; status.style.color = isError ? '#ffd0cb' : ''; }
function renderWeather(location, data) {
  const [description, symbol] = condition(data.current.weather_code);
  document.querySelector('#location-country').textContent = location.country;
  document.querySelector('#location-name').textContent = `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}`;
  document.querySelector('#updated-time').textContent = `Updated ${new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date())}`;
  document.querySelector('#temperature').textContent = `${Math.round(data.current.temperature_2m)}°`;
  document.querySelector('#weather-description').textContent = description;
  document.querySelector('#weather-symbol').textContent = symbol;
  document.querySelector('#humidity').textContent = `${data.current.relative_humidity_2m}%`;
  document.querySelector('#wind-speed').textContent = `${Math.round(data.current.wind_speed_10m)} km/h`;
  document.querySelector('#apparent-temperature').textContent = `${Math.round(data.current.apparent_temperature)}°`;
  document.querySelector('#forecast').innerHTML = data.daily.time.slice(0, 5).map((date, index) => { const [label, icon] = condition(data.daily.weather_code[index]); return `<article class="forecast-card"><p class="forecast-day">${formatDay(date)}</p><p class="forecast-icon" aria-label="${label}">${icon}</p><p class="forecast-temp">${Math.round(data.daily.temperature_2m_max[index])}° <span>/${Math.round(data.daily.temperature_2m_min[index])}°</span></p></article>`; }).join('');
  content.hidden = false; setStatus('Weather updated successfully.');
}
async function searchWeather(city) {
  setStatus(`Finding weather for ${city}…`); content.hidden = true;
  try {
    const placeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if (!placeResponse.ok) throw new Error('Location service is unavailable.');
    const placeData = await placeResponse.json();
    const location = placeData.results?.[0];
    if (!location) throw new Error('No matching city was found. Try a more specific search.');
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`);
    if (!weatherResponse.ok) throw new Error('Weather data is unavailable right now.');
    const weatherData = await weatherResponse.json();
    localStorage.setItem('skyline-last-city', location.name); renderWeather(location, weatherData);
  } catch (error) { setStatus(error.message || 'Something went wrong. Please try again.', true); }
}
form.addEventListener('submit', event => { event.preventDefault(); const city = cityInput.value.trim(); if (city) searchWeather(city); });
const lastCity = localStorage.getItem('skyline-last-city');
if (lastCity) { cityInput.value = lastCity; searchWeather(lastCity); }
