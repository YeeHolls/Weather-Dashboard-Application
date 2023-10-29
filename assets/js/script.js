// Function to fetch weather data from the OpenWeather API
function getWeatherData(cityName) {
    // Your OpenWeatherMap API key and API endpoint for current weather data
    const apiKey = "b346474f0c3706b4340366bfc3cc8be3";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
  
    // Fetch the weather data
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Extract and display current weather information
        const city = data.name;
        const date = new Date(data.dt * 1000); // Convert Unix timestamp to milliseconds
        const formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const weatherIcon = data.weather[0].icon;
  
        // Update the HTML with the weather data
        document.getElementById('city-name').textContent = city;
        document.getElementById('current-date').textContent = formattedDate;
        document.getElementById('temperature').textContent = `${temperature} °F`;
        document.getElementById('humidity').textContent = `${humidity} %`;
        document.getElementById('wind').textContent = `${windSpeed} MPH`;

        //Updates the weather icon
        displayWeatherIcon(weatherIcon, document.getElementById('weather-icon'));

        // Store the city in local storage for the search history
        storeCityInLocalStorage(city);

        //Call the get5DayForecast function to update the 5-day forecast
        get5DayForecast(city);
      })
      // Error Message
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }

  //Function to display the weather icon
  function displayWeatherIcon(iconCode, element) {
    // Construct the weather icon URL based on the icon code
    const iconURL = `https://openweathermap.org/img/w/${iconCode}.png`
    element.src = iconURL;
  }

  // Function to update the displayed weather for a specific city
  function updateWeatherForCity(cityName) {
    getWeatherData(cityName);
  }
  
  // Function to handle city search
  function handleCitySearch() {
    const cityInput = document.getElementById('cityInput').value;
    if (cityInput) {
      getWeatherData(cityInput);
    }
  }
  
  // Function to store the searched city in local storage
  function storeCityInLocalStorage(city) {
    // Retrieve the existing search history from local storage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    //Checks if the city is not already in the search history
    if (!searchHistory.includes(city)) {
        //Add the new city to the history
        searchHistory.push(city);
        //Store the updated history in local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        // Update the city buttons
        updateCityButtons();
    }
  }
  
  // Function to update the city buttons based on search history
  function updateCityButtons() {
    // Retrieve the search history from local storage
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory'))

    // Get the container for city buttons
    const cityButtonsDiv = document.querySelector('.city-buttons');
    cityButtonsDiv.innerHTML = '';
  
    // Loop through the search history and create buttons
    searchHistory.forEach((city) => {
      const button = document.createElement('button');
      button.className = 'city-button';
      button.textContent = city;
      button.setAttribute('data-city', city);
      cityButtonsDiv.appendChild(button);
    });
  }
  
  // Event listeners

  // Listen for a click on the search button
  document.getElementById('getWeatherButton').addEventListener('click', handleCitySearch);

  // Listen for a click on a city button in the history
  document.querySelector('.city-buttons').addEventListener('click', (event) => {
    if (event.target.classList.contains('city-button')) {
        const cityName = event.target.getAttribute('data-city');
        updateWeatherForCity(cityName); // Update weather for the selected city
    }
  });
  
// Function to fetch 5-day weather forecast data
function get5DayForecast(cityName) {
    // OpenWeatherMap API key and API endpoint for 5-day forecast
    const apiKey = "b346474f0c3706b4340366bfc3cc8be3";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;
  
    // Fetch the 5-day forecast data
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const forecastDatabyDate = {};

        // Group forecast data by date
        data.list.forEach ((forecast) => {
            const date = new Date(forecast.dt_txt).toLocaleDateString('en-US');
            if (!forecastDatabyDate[date]) {
                forecastDatabyDate[date] = [];
            }
            forecastDatabyDate[date].push(forecast);
        });

        // Get the list of the forecast dates
        const forecastDates = Object.keys(forecastDatabyDate);
        
        // Update the HTML for the next 5 days
        forecastDates.slice(0, 5).forEach((date, index) => {
            const forecastData = forecastDatabyDate[date];
            const forecastDay = document.querySelector(`.forecast-details .day:nth-child(${index + 1})`);
            const temperature = forecastData[0].main.temp;
            const humidity = forecastData[0].main.humidity;
            const windSpeed = forecastData[0].wind.speed;
            const weatherIcon = forecastData[0].weather[0].icon;

            forecastDay.querySelector('.date').textContent = date;
            forecastDay.querySelector('.temp').textContent = `${temperature} °F`;
            forecastDay.querySelector('.humidity').textContent = `${humidity} %`;
            forecastDay.querySelector('.wind').textContent = `${windSpeed} MPH`;

            // Update the weather icon in the forecast day
            const weatherIconElement = forecastDay.querySelector('img');
            displayWeatherIcon(weatherIcon, weatherIconElement);
         });
        }) 
      .catch((error) => {
        console.error('Error fetching 5-day forecast data:', error);
      });
  }

    // Clear local storage (remove this line if you want to keep search history)
  localStorage.clear();
