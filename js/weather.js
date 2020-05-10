const searchCity = document.getElementById("search");
const searchCitybtn = document.getElementById("searchbtn");
const weatherBodyFront = document.getElementById("weather-body-front");
const weatherBodyBack = document.getElementById("weather-body-back");
const erro = document.getElementById("erro");
const APIKEY = process.env.APIKEY;

var city;
var lastsearchedcity;

searchCitybtn.addEventListener("click", e => {
    e.preventDefault();
    const cityValue = (searchCity.value).toLowerCase();

    if(lastsearchedcity == cityValue)
        return erro.innerHTML = "You are already seeing the weather for "+cityValue;
    lastsearchedcity = cityValue;
    erro.innerHTML = "";
    
    weatherBodyFront.innerHTML = "";
    weatherBodyBack.innerHTML = "";

    fetchWeather(cityValue);
})

searchCity.addEventListener("keyup", e => {
    if (event.key === "Enter") {
        const cityValue = (searchCity.value).toLowerCase();
        
        if(lastsearchedcity == cityValue)
            return erro.innerHTML = "You are already seeing the weather for "+cityValue;
        lastsearchedcity = cityValue;
        erro.innerHTML = "";
        weatherBodyFront.innerHTML = "";
        weatherBodyBack.innerHTML = "";

        if(cityValue)
            fetchWeather(cityValue);
    }
})

function fetchWeather(city) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+APIKEY+'&units=metric')
    .then(response => response.json())
    .then(data => {
            if(!data.sys) {
                weatherBodyFront.innerHTML = "Couldn't find that city.";
                weatherBodyBack.innerHTML = "Couldn't find that city.";
                return;
            }

            localStorage.setItem("city", city);

            const front = document.createElement('div');
            const back = document.createElement('div');
            front.classList.add('weather');
            front.innerHTML = `
                <h4 class="text-center">Weather in ${data.name}, ${data.sys.country}</h4>
                <div class="flex col-sm-12">
                    <figure class="col-sm-6 text-center">
                        <img class="city-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                    </figure>
                    <p class="col-sm-6 text-center"><b>Current:</b><br>${Math.round(data.main.temp)} ºC</p>
                </div>
                <p class="text-center"><b>Description:</b><br>${data.weather[0].main} - ${data.weather[0].description}</p>
                <br>
                <h6> To check more details, click anywhere inside this box </h6>      
            `;
            back.classList.add('weather');
            back.innerHTML = `
                <h4 class="text-center">Details</h4>
                <div class="flex col-sm-12">
                    <p class="col-sm-4 text-center"><b>Feels like:</b><br>${Math.round(data.main.feels_like)} ºC</p>
                    <p class="col-sm-4 text-center"><b>Highest:</b><br>${Math.round(data.main.temp_max)} ºC</p>
                    <p class="col-sm-4 text-center"><b>Lowest:</b><br>${Math.round(data.main.temp_min)} ºC</p>             
                </div>
                <br>
                <h6> To return to, click anywhere outside this box </h6>  
            `;
            weatherBodyFront.appendChild(front);
            weatherBodyBack.appendChild(back);
        }
    )
    .catch(function(error) {
        console.log(error);
    });   					
}

window.onload = function(){
    if(localStorage.getItem("city")){
        city = localStorage.getItem("city"); 
        fetchWeather(city);
    }
  }