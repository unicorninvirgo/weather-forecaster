const appid = "08d49bc0f4618f045068d208cad890c5";
const weathermapURL = "https://api.openweathermap.org/data/2.5/weather";
const city = "";
const lat = "";
const long = "";

let citySearch = [];

function searchCity(event){

    event.preventDefault();
    let userCitySearch =  $("#city-search").val()

    citySearch.push(userCitySearch.toLowerCase());

    localStorage.setItem("citySearch",JSON.stringify(citySearch));
   
}

function retrieveSearchHistory(){

    let citySearch = JSON.parse(localStorage.getItem("citySearch"));

    if(citySearch === null)
    {
        citySearch = [];
    }
    else{
       
        citySearch.forEach(element => {

            $("#city-search-section-output").append(
                `<button class="btn btn-dark" type="button" id="city-hist-btn" data-city-search="${element}">${element}</button>`
            );

            
        });
     

    }

   
}

var getSearchHistory = function (city) {
    var apiUrl = weathermapURL + '?q=' +city + '&units=imperial&appid=' + appid;

  fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displaySearchHeader(data);
            getSearchLocation(data.coord.lat, data.coord.lon);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Weather App');
      });
  };

  var getSearchLocation = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${appid}`

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displaySearchHist(data);
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

function displaySearchHeader(data){
    
    let cityName = data.name;
    let cityTemp = data.main.temp;
    let cityWindSpeed = data.wind.speed;
    let cityHumidity = data.main.humidity;
    let cityLatitude = data.coord.lat;
    let cityLongitude = data.coord.lon;
    let weatherDate = formatUnixDate(data.dt);

    $(".city-weather-today").append(`<h1>${cityName}&nbsp${weatherDate}</h1>
    <br>Temp: ${cityTemp}F
    <br>Wind: ${cityWindSpeed}MPH
    <br>Humidity: ${cityHumidity}%
    <br>UV Index: 00.00`);

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
    $("#city-hist-btn").on("click",function(event){});
}


function init(){

    getSearchHistory('atlanta');
    retrieveSearchHistory();
    setEventListeners();
}

init();