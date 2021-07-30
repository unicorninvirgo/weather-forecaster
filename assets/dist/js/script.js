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
    var apiUrl = weathermapURL + '?q=' +city + '&appid=' + appid;

    https://api.openweathermap.org/data/2.5/onecall?lat=41.85&lon=-87.65&exclude=minutely,hourly,alerts&appid=08d49bc0f4618f045068d208cad890c5

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

    console.log(data.name);
    console.log(data.main.temp);
    console.log(data.wind.speed);
                console.log(data.main.humidity);
                    console.log(data.coord.lat);
                        console.log(data.coord.lon);

}

function displaySearchHist(data){
    var dateString = moment.unix(data.current.dt).format("MM/DD/YYYY");
    console.log(dateString);
    console.log(data);

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