//date time format function constructor
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

	//Icon selection 
	
	if (weatherDescription.textContent === "Clear") {
		iconWheatherElement.setAttribute("src",`src/svg/sun-icon.svg`)
	} else if (weatherDescription.textContent === "Rain") {
		iconWheatherElement.setAttribute("src",`src/svg/cloud-rain.svg`)
	} else if (weatherDescription.textContent === "Snow") {
		iconWheatherElement.setAttribute("src",`src/svg/snow.svg`)
	} else if (weatherDescription.textContent === "Thunderstorm"){
		iconWheatherElement.setAttribute("src",`src/svg/cloud-light.svg`)
	} else if (weatherDescription.textContent === "Mist"){
		iconWheatherElement.setAttribute("src",`src/svg/sun-wind.svg`)
	} else if (weatherDescription.textContent === "Clouds"){
		iconWheatherElement.setAttribute("src",`src/svg/cloud-sun.svg`)
	} else {
		iconWheatherElement.src = `src/svg/cloudy.svg`;
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
}
function handleCelciusLink(event) {
	event.preventDefault();
	let tem = document.getElementById("temp");
	document.getElementById("celcius").classList.add("active");
	document.getElementById("fahrenheit").classList.remove("active");
	let converted = celciusTemperature;
	tem.innerHTML = converted;
}

function retrievePosition(position) {
	let apiKey = "2120c535876391f18db8ca2cc1fdc54e";
	let lat = position.coords.latitude.toFixed(2);
	let lon = position.coords.longitude.toFixed(2);
	let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
	axios.get(url).then(displayTemperature);
}
function handleCurrentLocation() {
	navigator.geolocation.getCurrentPosition(retrievePosition);
}

function loadData(city) {
	let myKey = "2120c535876391f18db8ca2cc1fdc54e";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${myKey}`;
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



