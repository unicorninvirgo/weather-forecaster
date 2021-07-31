const appid = "08d49bc0f4618f045068d208cad890c5";
const weathermapURL = "https://api.openweathermap.org/data/2.5/weather";
const city = "";
const lat = "";
const long = "";

let citySearch = [];

function searchCity(event){

    event.preventDefault();
    let userCitySearch =  $("#city-search").val();

    citySearch.push(userCitySearch.toLowerCase());

    localStorage.setItem("citySearch",JSON.stringify(citySearch));   
    getSearchHistory(userCitySearch);
    $("#city-search").text('');
    //retrieveSearchHistory();
}

function retrieveSearchHistory(){

    citySearch = JSON.parse(localStorage.getItem("citySearch"));

    if(citySearch === null)
    {
        citySearch = [];
    }
    else{
       
        citySearch.forEach(element => {

            $("#city-search-section-output").append(
                `<div class="d-grid gap-2 city-search-hist"><button class="btn btn-secondary btn-lg" type="button" id="city-hist-btn" data-city-search="${element}">${element}</button></div>`
            );
            
        });   

    }
   
}

var getSearchHistory = function (city) {
    $(".city-weather-today").html("");
    $(".city-weather-future").html("");

    var apiUrl = weathermapURL + '?q=' +city + '&units=imperial&appid=' + appid;

  fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            //displaySearchHeader(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var city = data.name;

            getSearchLocation(lat, lon, city);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Weather App');
      });
  };

var getSearchLocation = function (lat, lon, city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${appid}`

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displaySearchData(data, city);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Weather App');
      });
  };

function getSearchResults(data){
    console.log(data.coord.lat);
}

function displaySearchData(data, city){
    
    let current = data.current;
    let daily = data.daily;

   /* let cityName = data.name; */
    let cityTemp = current.temp;
    let cityWindSpeed = current.wind_speed;
    let cityHumidity = current.humidity;
    let cityUVI = current.uvi;
    let weatherDate = formatUnixDate(current.dt);

    $(".city-weather-today").append(`<h1>${city}&nbsp${weatherDate}</h1>
        <br>Temp: ${cityTemp}F
        <br>Wind: ${cityWindSpeed} MPH
        <br>Humidity: ${cityHumidity}%
        <br>UV Index: ${cityUVI}`);

    daily.forEach( element => {

        let dailyTemp = element.temp;
        let dailyWindSpeed = element.wind_speed;
        let dailyHumidity = element.humidity;
        let dailyUVI = element.uvi;
        let dailyWeatherDate = formatUnixDate(element.dt);

        $(".city-weather-future").append(`<h3>${dailyWeatherDate}</h3>
            <br>Temp: ${dailyTemp} F
            <br>Wind: ${dailyWindSpeed} MPH
            <br>Humidity: ${dailyHumidity}%
            <br>UV Index: ${dailyUVI}`);
        });

}

function displaySearchHist(data){
    var dateString = moment.unix(data.current.dt).format("MM/DD/YYYY");
    console.log(dateString);
    console.log(data);

}

formatUnixDate = function(date){
    return moment.unix(date).format("MM/DD/YYYY")
}

function setEventListeners(){
    $("#city-search-btn").on("click",searchCity);
    $(".city-btn-list").on("click",".city-search-hist", function(event){
        var citySearch = $(event.target).attr('data-city-search');
        getSearchHistory(citySearch);
    });
}


function init(){

   // getSearchHistory('atlanta');
    retrieveSearchHistory();
    setEventListeners();
}

init();