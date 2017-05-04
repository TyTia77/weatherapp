var app = angular.module('weather', []);

app.factory('weatherApi', ['$http', function($http){
    var obj = {};
    var cors = 'https://cors-anywhere.herokuapp.com/';

    obj.getUserLocation = function() {
        return $http.get("http://ipinfo.io/json");
    };

    obj.getWeather = function(city){
        var api = "http://api.openweathermap.org/data/2.5/weather?";
        var units = "&units=metric";
        var appid = "&APPID=061f24cf3cde2f60644a8240302983f2";

        return $http.get(cors +api +city +units +appid);
    };
    
    return obj;
}]);

app.controller('mainCtrl', ['$scope', 'weatherApi', function($scope, weatherApi){
    $scope.data = {};
    getLocation();

    function handleErr(err){
        console.log(err);
    }

    function getLocation(){
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(getPosition);
        } else{
            weatherApi.getUserLocation().then(function(a){
                var temp = a.data.loc.split(',');
                getWeather(temp);
            });
        }
    }

    function getWeather(location){
        weatherApi.getWeather(location).then(function(a){
            $scope.data.temp = Math.floor(a.data.main.temp);
            $scope.data.weather = a.data.weather[0].description;
            setIcon(a.data.weather[0].description);
            $scope.data.city = a.data.name;
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
    var url = 'icons/animated/';
    var temp;
    var svg = '.svg';
        switch(weather){
            case 'clear sky':
                temp = 'day';
                break;

            case 'few clouds':
            case 'scattered clouds':
            case 'broken clouds':
            case 'mist':
                temp = 'cloudy';
                break;

            case 'shower rain':
                temp = 'rainy-6';
                break;

            case 'rain':
                temp = 'rainy-7';
                break;

            case 'thunderstorm':
                temp = 'thunder';
                break;

            case 'snow':
                temp = 'snowy-6';
                break;

            default:
                console.log('not found');
        }

        $scope.iconLink = url +temp +svg;
    }
}]);
