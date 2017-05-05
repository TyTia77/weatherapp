var app = angular.module('weather', []);

app.factory('weatherApi', ['$http', function($http){
    var obj = {};
    var cors = 'https://cors-anywhere.herokuapp.com/';

    obj.getUserLocation = function() {
        return $http.get("http://ipinfo.io/json");
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
    getDateTime();

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
            console.log(a.data);
            $scope.data.temp = Math.floor(a.data.list[0].temp.day);
            $scope.data.weather = a.data.list[0].weather[0].description;
            setIcon(a.data.list[0].weather[0].description);
            $scope.data.city = a.data.city.name;
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
            case 'sky is clear':
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

    function getDateTime(){
        var dayarr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
        'saturaday'];
        var montharr = ['january', 'feburary', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'november', 'december'];
        var test = new Date();

        var day = test.getDay();
        var month = test.getMonth();
        var year = test.getFullYear();
        var date = day +'/' +month +'/' +year;

        var hour = test.getHours();
        var min = test.getMinutes();
        var time = hour +':' +min;

        console.log('date', date);
        console.log('time', time);

        $scope.date = dayarr[day]+' ' +montharr[month] +' ' +year;
    }
}]);
