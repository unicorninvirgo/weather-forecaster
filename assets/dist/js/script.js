const appid = "08d49bc0f4618f045068d208cad890c5";
const weathermapURL = "https://api.openweathermap.org/data/2.5/weather";
const city = "";
const lat = "";
const long = "";

let citySearch = [];

//hide main section on load
$("#city-weather-results-section").hide();

//search for city data
function searchCity(event){

    event.preventDefault();

    //read city
    let userCitySearch =  $("#city-search").val();
  
    //lookup
    getSearchHistory(userCitySearch);
    

}

//retrieve and display search history
function retrieveSearchHistory(){

    citySearch = JSON.parse(localStorage.getItem("citySearch"));

    if(citySearch === null)
    {
        citySearch = [];
    }
    else{
       
        $("#city-search-section-output").html('');

        citySearch.forEach(element => {

            $("#city-search-section-output").append(
                `<div class="d-grid gap-2 city-search-hist"><button class="btn btn-secondary btn-lg" type="button" id="city-hist-btn" data-city-search="${element}">${element}</button></div>`
            );
            
        });   

    }
   
}

//save city search
function saveSearch(userCitySearch){

    //check if searcha already exists
    let searchHist = citySearch.filter( x => x === userCitySearch.toLowerCase());
    
     //only save new searches
    if(searchHist.length === 0)
    {
        citySearch.push(userCitySearch.toLowerCase());

        //save city
        localStorage.setItem("citySearch",JSON.stringify(citySearch)); 
    }  

}

//get city data
var getSearchHistory = function (city) {
    $(".city-weather-today").html("");
    $(".city-weather-future").html("");

  
   var apiUrl = weathermapURL + '?q=' +city + '&units=imperial&appid=' + appid;

   fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
           

            saveSearch(data.name);
            $("#city-weather-results-section").show();

            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var city = data.name;

            getSearchLocation(lat, lon, city);

          });
        } else {
            alert("Not a valid city");
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Weather App');
      });

      $("#city-search").val('');
  };

//get detail data
var getSearchLocation = function (lat, lon, city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${appid}`

    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            displaySearchData(data, city);
            retrieveSearchHistory();
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Weather App');
      });
  };

//display data to user
function displaySearchData(data, city){
    
    let current = data.current;
    let daily = data.daily;

    let cityTemp = current.temp;
    let cityWindSpeed = current.wind_speed;
    let cityHumidity = current.humidity;
    let cityUVI = current.uvi;
    let weatherDate = formatUnixDate(current.dt);

    let counter = 1;

    
    daily.forEach( element => {

            
            let dailyTemp = element.temp.day;
            let dailyWindSpeed = element.wind_speed;
            let dailyHumidity = element.humidity;
            let dailyUVI = element.uvi;
            let dailyWeatherDate = formatUnixDate(element.dt);
            let weatherIcon = "http://openweathermap.org/img/wn/" + element.weather[0].icon + "@2x.png"

            if(counter === 1){

                $(".city-weather-today").append(`<h2>${city}&nbsp${weatherDate}<img src="${weatherIcon}"></h2>
                <br>Temp: ${cityTemp}F
                <br>Wind: ${cityWindSpeed} MPH
                <br>Humidity: ${cityHumidity}%
                <br>UV Index: ${cityUVI}`);

            }
            else if(counter <= 6){
                $(".city-weather-future").append(`<div class="card"><h4>${dailyWeatherDate}</h4>
                    <br> <img src="${weatherIcon}">
                    <br>Temp: ${dailyTemp} F
                    <br>Wind: ${dailyWindSpeed} MPH
                    <br>Humidity: ${dailyHumidity}%
                    <br>UV Index: ${dailyUVI}</div>`);
            }

            counter++;
         
        });


}


//format unix date
formatUnixDate = function(date){
    return moment.unix(date).format("MM/DD/YYYY")
}


//set button and linke event listeners
function setEventListeners(){
    //search
    $("#city-search-btn").on("click",searchCity);

    //history search
    $(".city-btn-list").on("click",".city-search-hist", function(event){
        var citySearch = $(event.target).attr('data-city-search');
        getSearchHistory(citySearch);
    });

    //clear history
    $("#clear").on("click", function(){
        localStorage.clear();
        location.reload();
    })
}


//initiate application
function init(){

    retrieveSearchHistory();
    setEventListeners();
}

init();