var app = angular.module('weather', []);

app.factory('weatherApi', ['$http', function($http){
    var obj = {};
    var cors = 'https://cors-anywhere.herokuapp.com/';

    obj.getUserLocation = function() {
        return $http.get("https://ipinfo.io/json");
    };

    obj.getWeather = function(city){
        var api = "http://api.openweathermap.org/data/2.5/forecast/daily?";
        var units = "&units=metric";
        var appid = "&APPID=061f24cf3cde2f60644a8240302983f2";
        var days = "&cnt=5";

        return $http.get(cors +api +city +units +appid +days);
    };

    return obj;
}]);

app.controller('mainCtrl', ['$scope', 'weatherApi', function($scope, weatherApi){
    $scope.data = {};
    $scope.temp = {};
    $scope.location = {};

    getLocation();

    function handleErr(err){
        console.log(err);
    }

    function getLocation(){
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(getPosition, function(err){
                console.log(err);
            });
        } else{
            weatherApi.getUserLocation().then(function(a){
                var temp = a.data.loc.split(',');
                getWeather(temp);
            });
        }
    }

    function getWeather(location){
        weatherApi.getWeather(location).then(function(data){

            var city = data.data.city;
            var list = data.data.list;
            $scope.location.today = {};
            $scope.location.forecast = [];

            list.forEach(function(value, index){
                if (!index){

                    $scope.location.today = {
                        date: getDateTime(index),
                        temp: mapTemp(value.temp),
                        city: city.name,
                        country: city.country,
                        clouds: value.clouds,
                        humidity: roundNearest(value.humidity),
                        pressure: roundNearest(value.pressure),
                        wind: roundNearest(value.speed),
                        icon: setIcon(value.weather[0].main)
                    }

                    $scope.location.today.weather = {
                        name: value.weather[0].main,
                        description: value.weather[0].description
                    }

                } else {

                    $scope.location.forecast.push({
                        icon: setIcon(value.weather[0].main),
                        day: getDateTime(index),
                        temp: mapTemp(value.temp),
                        weather: {
                            name: value.weather[0].main,
                            description:  value.weather[0].description
                        }
                    });

                }
            });



            $scope.ready = true;
        }).catch(handleErr);
    }

    function getPosition(position){
        var location;
        if(Array.isArray(position)){
            location = 'lat=' +temp[0] +'&lon=' +temp[1];
        } else {
            location = 'lat=' +position.coords.latitude +'&lon=' +
            position.coords.longitude;
            getWeather(location);
        }
    }

    function setIcon(weather){

        var icon = {
            Clear: 'ion-ios-sunny-outline',
            Clouds: 'ion-ios-cloudy-outline',
            Rain: 'ion-ios-rainy-outline',
            thunderstorm: 'ion-ios-thunderstorm-outline',
            snow: 'ion-ios-snowy'
        }

        return icon[weather];
    }

    // day will tell us what day we want,
    // 0 for today 1 for tomor etc
    function getDateTime(day){
        var dayarr = [
            'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
            'saturaday'
        ];

        var montharr = [
            'january', 'feburary', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'november', 'december'
        ];

        var Today = new Date();
        var today = Today.getDay();
        var month = Today.getMonth();
        var year = Today.getFullYear();

        if (!day){
            return dayarr[getDay(today, day)].slice(0, 3) +', ' +montharr[month] +' ' +year;
        } else {
            return dayarr[getDay(today, day)].slice(0, 3);
        }
    }

    // accepts object of floating temp values,
    // returns values rounded down eg 17.34 to 17
    function mapTemp(arr){
        Object
            .keys(arr)
            .map(function(temp){
                 arr[temp] = Math.floor(arr[temp]);
            });

        // returns an object
        return arr;
    }

    function roundNearest(value){
        return Math.round(value);
    }

    // return the correct index corresponding to
    // the day 0 for sunday 6 for saturday
    function getDay(today, nextday){
        var total =  today + nextday;
        return total > 6 ? total - 7 : total;
    }
}]);
