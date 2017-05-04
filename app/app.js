var app = angular.module('weather', []);

app.factory('weatherApi', ['$http', function($http){
    var obj = {};
    var cors = 'https://cors-anywhere.herokuapp.com/';

    obj.getUserLocation = function() {
        return $http.get("http://ipinfo.io/json");
    };

    obj.getWeather = function(city){
        // var api = "http://api.openweathermap.org/data/2.5/weather?q=";
        var api = "http://api.openweathermap.org/data/2.5/weather?";
        var units = "&units=metric";
        var appid = "&APPID=061f24cf3cde2f60644a8240302983f2";

        // api = type ? api : api.slice(0, api.length -2);

        console.log(api);
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
            navigator.geolocation.getCurrentPosition(getPosition)
        } else{
            weatherApi.getUserLocation().then(function(a){
                 console.log(a);
                var temp = a.data.loc.split(',');
                var location = 'lat=' +temp[0] +'&lon=' +temp[1];
                getWeather(location);
            });
        }
    }

    function getWeather(location){
        weatherApi.getWeather(location).then(function(a){
            console.log(JSON.stringify(a, null, 2));
            $scope.data.temp = Math.floor(a.data.main.temp);
            $scope.data.weather = a.data.weather[0].description;
            setIcon(a.data.weather[0].description);
            $scope.icon = a.data.weather[0].icon;
            $scope.data.city = a.data.name;
        }).catch(handleErr);
    }

    function getPosition(position){
        var location = 'lat=' +position.coords.latitude +'&lon=' +position.coords.longitude;
        getWeather(location);
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
                temp = 'cloudy';

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

            case 'mist':
                temp = 'cloudy';
                break;
        }

        $scope.iconLink = url +temp +svg;
    }
}]);
