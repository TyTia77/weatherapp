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
    var location = '';
    $scope.data = {};
    getLocation();

    weatherApi.getUserLocation().then(function(data){
        var location = '';
        for (var d in data.data){
            if (d === 'city') location += data.data[d] +', ';
            if (d === 'country') location += data.data[d];
        }

        // $scope.data.city = location;
        console.log($scope.data)
        console.log(data);

        weatherApi.getWeather(location).then(function(a){
            console.log(JSON.stringify(a, null, 2));
            $scope.data.temp = Math.floor(a.data.main.temp);
            $scope.data.weather = a.data.weather[0].description;
        }).catch(handleErr);
    }).catch(handleErr);

    function handleErr(err){
        console.log(err);
    }

    function getLocation(){
        navigator.geolocation ? navigator.geolocation.getCurrentPosition(getPosition)
                                       : $scope.test = 'not supported'
    }

    function getPosition(position){
        lat=35&lon=139
        location += 'lat=' +position.coords.latitude; +'&lon=' +position.coords.longitude;
        $scope.lat = position.coords.latitude;
        $scope.long = position.coords.longitude;
        $scope.$apply();
    }
}]);
