//date time format function constructor
let temperatureUnit = "metric";
function formatDate() {
	var e = new Date();
	let dayName = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	let dayN = dayName[e.getDay()];
	let monthName = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	let month = monthName[e.getMonth()];
	let minutes = e.getMinutes();
	var e = new Date();
	let hour = e.getHours();
	let meridiem;
	if (hour > 12) {
		meridiem = "PM";
		hour = hour - 12;
	} else {
		meridiem = "AM";
	}
	if (hour < 10) {
		hour = "0" + hour;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	document.getElementById(
		"time-label"
	).innerHTML = `${dayN}, ${e.getDate()} ${month} ${hour}:${minutes} ${meridiem}`;
	setTimeout(formatDate, 1000);
}

function formatDay(timestamp){
	let date = new Date(timestamp * 1000);
	let day = date.getDay();
	let daysName = ["SUN","MON","TUE", "WED", "THU", "FRI", " SAT"];

	return daysName[day];
};

function displayForecast(response){
	let forecast = response.data.daily;
	
	let forecastElemenent = document.getElementById("weather-forecast");
	let forecastHTML = "";
	forecast.forEach( function (forecastDay, index){
	if (index > 0 && index < 7){
		forecastHTML += `
		<div class="row row-forecast">
			<div class="weekly-constructor d-flex justify-content-center">
				<img src="${iconSelection(forecastDay.weather[0].main)}">
				<div>
					<span class="day-temp">${Math.round(forecastDay.temp.max)}°/</span>
					<span class="night-temp"> ${Math.round(forecastDay.temp.min)}° </span>
					<span class="day-label">${formatDay(forecastDay.dt)}</span>
				</div>
			</div>
		</div>`;
		forecastElemenent.innerHTML = forecastHTML;
	}
	})
}

function getForecast(coordinates){
	console.log(coordinates);
	
	let apiKey = "2120c535876391f18db8ca2cc1fdc54e";
	let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${temperatureUnit}`;
	axios.get(apiUrl).then(displayForecast);
}
function displayTemperature(response) {
	let temperatureElement = document.getElementById("temp");
	let nameCity = response.data.name;
	let humidity = response.data.main.humidity;
	let windSpeed = response.data.wind.speed;
	let iconWheatherElement = document.getElementById("icon-weather");
	let weatherDescription = document.getElementById("weather-description");
	
	celciusTemperature = response.data.main.temp.toFixed(1);
	temperatureElement.innerHTML = `${celciusTemperature}`;
	document.getElementById("location").innerHTML = nameCity;
	document.getElementById("humidity").innerHTML = `${humidity} %`;
	document.getElementById("wind-speed").innerHTML = `${windSpeed} km/h`;
	weatherDescription.innerHTML = response.data.weather[0].main;
	console.log(weatherDescription.textContent)

	//Icon selection 
	iconWheatherElement.setAttribute("src",iconSelection(weatherDescription.textContent))
	getForecast(response.data.coord)
}
function iconSelection(iconDescription){
	let timePeriod = (new Date()).getHours();
	console.log(timePeriod)
	if (iconDescription === "Clear") {
		if(timePeriod >5 && timePeriod < 20){
			return `src/svg/sun-icon.svg`
		} else {
			return `src/svg/clear-moon.svg`
		}
	} else if (iconDescription === "Rain") {
		return `src/svg/cloud-rain.svg`
	} else if (iconDescription === "Snow") {
		return `src/src/svg/snow.svg`
	} else if (iconDescription === "Thunderstorm"){
		return `src/svg/cloud-light.svg`
	} else if (iconDescription === "Mist"){
		return `src/svg/sun-wind.svg`
	} else if (iconDescription === "Clouds"){
		if (timePeriod >5 && timePeriod < 20){
			return `src/svg/cloud-sun.svg`
		}else {
			return `src/svg/cloudy-moon.svg`
		}	
	} else {
		return `src/svg/cloudy.svg`
	}
}
function handleFahrenheitLink(event) {

	event.preventDefault();
	let tem = document.getElementById("temp");
	//remove the active class from the celcius link
	document.getElementById("celcius").classList.remove("active");
	document.getElementById("fahrenheit").classList.add("active");
	let converted = Math.round(
		(celciusTemperature * 9) / 5 + 32
	).toFixed(1);
	tem.innerHTML = converted;
	temperatureUnit = "imperial";
	let city = document.getElementById("location").innerHTML;
	loadData(city);
	
}
function handleCelciusLink(event) {
	event.preventDefault();
	let tem = document.getElementById("temp");
	document.getElementById("celcius").classList.add("active");
	document.getElementById("fahrenheit").classList.remove("active");
	let converted = celciusTemperature;
	tem.innerHTML = converted;
	temperatureUnit = "metric";
	let city = document.getElementById("location").innerHTML;
	loadData(city);
}

function retrievePosition(position) {
	let apiKey = "2120c535876391f18db8ca2cc1fdc54e";
	let lat = position.coords.latitude.toFixed(2);
	let lon = position.coords.longitude.toFixed(2);
	let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${temperatureUnit}&appid=${apiKey}`;
	axios.get(url).then(displayTemperature);
}
function handleCurrentLocation() {
	navigator.geolocation.getCurrentPosition(retrievePosition);
	loadQuote();
}

function loadData(city) {
	let myKey = "2120c535876391f18db8ca2cc1fdc54e";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${temperatureUnit}&appid=${myKey}`;
	axios.get(apiUrl).then(displayTemperature);
}



function handleClick() {
	let city = document.getElementById("city").value.toLowerCase();
	loadData(city);
	loadQuote();
}

window.onload = function initializeMyAwesomeApp() {
	// Function to be executed
	initialize();
	loadData("Paris");
	loadQuote();
};

async function loadQuote() {
	const response = await (await fetch("https://type.fit/api/quotes")).json();

	const responseLength = response.length;
	const randomNumber = Math.floor(Math.random() * responseLength);
	const quoteGenerated = response[randomNumber];
	let quoteElement = document.getElementById("quote");
	quoteElement.innerHTML = quoteGenerated.text + ' ~ ' + quoteGenerated.author;

}

function initialize() {
//constants
const btn = document.getElementById("change-city");
const btnCurrent = document.getElementById("current-city");

btn.addEventListener("click", handleClick);
const input = document.getElementById("city");
// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
	  // Cancel the default action, if needed
	  event.preventDefault();
	  // Trigger the button element with a click
	  document.getElementById("change-city").click();
	  input.value = '';
	}
  });
 
btnCurrent.addEventListener("click", handleCurrentLocation);

document.getElementById("celcius").addEventListener("click", handleCelciusLink);
document.getElementById("fahrenheit").addEventListener("click", handleFahrenheitLink);

//main
formatDate();
}



