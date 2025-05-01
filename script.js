const citySelect = document.getElementById('city-select');
const currentLocationBtn = document.getElementById('current-location-btn');
const messageEl = document.getElementById('message');
const errorEl = document.getElementById('error-message');
const resultsEl = document.getElementById('results');
const locationTitle = document.getElementById('location-title');

async function fetchSunData(lat, lng, locationName) {
  const baseUrl = 'https://api.sunrisesunset.io/json';
  try {
    messageEl.style.display = 'none';
    errorEl.style.display = 'none';
    resultsEl.style.display = 'none';

    const [todayRes, tomorrowRes] = await Promise.all([
      fetch(`${baseUrl}?lat=${lat}&lng=${lng}&date=today`),
      fetch(`${baseUrl}?lat=${lat}&lng=${lng}&date=tomorrow`)
    ]);

    const todayData = await todayRes.json();
    const tomorrowData = await tomorrowRes.json();

    if (!todayData.results || !tomorrowData.results) {
      throw new Error('Invalid API response');
    }

    locationTitle.textContent = locationName;

    updateDay(todayData.results, 'today');
    updateDay(tomorrowData.results, 'tomorrow');

    resultsEl.style.display = 'block';
  } catch (error) {
    console.error(error);
    errorEl.textContent = 'Error fetching data. Please try again.';
    errorEl.style.display = 'block';
  }
}

function updateDay(data, prefix) {
  document.getElementById(`${prefix}-sunrise`).textContent = data.sunrise;
  document.getElementById(`${prefix}-sunset`).textContent = data.sunset;
  document.getElementById(`${prefix}-dawn`).textContent = data.dawn;
  document.getElementById(`${prefix}-dusk`).textContent = data.dusk;
  document.getElementById(`${prefix}-noon`).textContent = data.solar_noon;
  document.getElementById(`${prefix}-length`).textContent = data.day_length;
  document.getElementById(`${prefix}-timezone`).textContent = data.timezone;
}

citySelect.addEventListener('change', () => {
  const [lat, lng] = citySelect.value.split(',');
  const name = citySelect.options[citySelect.selectedIndex].text;
  fetchSunData(lat, lng, name);
});

currentLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchSunData(position.coords.latitude, position.coords.longitude, 'Current Location');
      },
      (error) => {
        console.error(error);
        errorEl.textContent = 'Unable to access your location.';
        errorEl.style.display = 'block';
      }
    );
  } else {
    errorEl.textContent = 'Geolocation is not supported in your browser.';
    errorEl.style.display = 'block';
  }
});
