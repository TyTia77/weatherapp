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
    $scope.temp = {};
    $scope.location = {};
    $iconLink = setIcon('rain');

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
        weatherApi.getWeather(location).then(function(data){
            console.log(data.data);
            $scope.location.today = {};
            $scope.location.forecast = [];

            for(var i = 0; i < data.data.list.length; i++){
                if (i === 0){
                    $scope.location.today ={
                        date: getDateTime(i),
                        temp: mapTemp(data.data.list[i].temp),
                        city: data.data.city.name,
                        country: data.data.city.country,
                        icon: setIcon(data.data.list[i].weather[0].main)
                    };
                    $scope.location.today.weather = {
                        name: data.data.list[i].weather[i].main,
                        description: data.data.list[i].weather[i].description
                    };
                } else {
                    $scope.location.forecast.push({
                        icon: setIcon(data.data.list[i].weather[0].main),
                        day: getDateTime(i),
                        temp: mapTemp(data.data.list[i].temp),
                        weather: {
                            name: data.data.list[i].weather[0].main,
                            description:  data.data.list[i].weather[0].description
                        }
                    });
                }
            }

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
    console.log(weather);
        switch(weather){
            case 'Clear':
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

            case 'Rain':
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

        return url +temp +svg;
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

        if (day === 0){
            return dayarr[getDay(today, day)].slice(0, 3) +', ' +montharr[month] +' ' +year;
        } else {
            return dayarr[getDay(today, day)].slice(0, 3);
        }
    }

    // accepts object of floating temp values,
    // returns values rounded down eg 17.34 to 17
    function mapTemp(arr){
        Object.keys(arr).map(function(temp){
             arr[temp] = Math.floor(arr[temp]);
        });

        return arr;
    }

    function getDay(today, nextday){
        var total =  today + nextday;
        if (total > 6){
            return total - 7;
        } else {
            return total;
        }
    }
}]);
