var testingAngluarApp = angular.module('testingAngularApp', []);

testingAngluarApp.controller('testingAngularCtrl', function ($rootScope, $scope, $http, $timeout, convertKelvinToCelsius) {

	$scope.title = "Testing AngularJS Applications";

	$scope.destinations = [];
	$scope.apiKey = "81c8b5e182b97956483088128dfff819";

	$scope.newDestination = {
		city: undefined,
		country: undefined
	};

	$scope.addDestination = function () {
		$scope.destinations.push({
			city: $scope.newDestination.city,
			country: $scope.newDestination.country
		});

		$scope.newDestination.city = '';
		$scope.newDestination.country = '';
	};

	$scope.removeDestination = function (index) {
		$scope.destinations.splice(index, 1);
	};

	$rootScope.messageWatcher = $rootScope.$watch('message', function () {
		if ($rootScope.message) {
			$timeout(function () {
				$rootScope.message = null;
			}, 3000);
		}
	});

});

testingAngluarApp.filter("warmestDestinations", function () {
	return function (destinations, minimumTemp) {
		var warmestDestinations = [];

		warmestDestinations = destinations.filter(function (destination) {
			if (!!destination.weather && !!destination.weather.temp && destination.weather.temp > minimumTemp) {
				return destination;
			}
		});

		return warmestDestinations;
	}
});

testingAngluarApp.directive('destination', function () {
	return {
		restrict: 'E',
		scope: {
			destination: '=',
			apiKey: '=',
			onRemove: '&'
		},
		template: '<span>{{destination.city}}, </span>' +
			'<span>{{destination.country}}</span>' +
			'<span ng-if="destination.weather"> - {{destination.weather.main}} {{destination.weather.temp}}°</span>' +
			'<button ng-click="onRemove()">X</button>' +
			'<button ng-click="getWeather(destination)">Update weather</button>',
		controller: function ($http, $rootScope, $scope, convertKelvinToCelsius) {
			$scope.getWeather = function (destination) {
				$http
					.get("http://api.openweathermap.org/data/2.5/weather?q=" + destination.city + "&appid=" + $scope.apiKey)
					.then(
						function (response) {
							if (response.data.weather) {
								destination.weather = {};
								destination.weather.main = response.data.weather[0].main;
								destination.weather.temp = $scope.convertKelvinToCelsius(response.data.main.temp);
							} else {
								$rootScope.message = "City not found";
							}
						},
						function (err) {
							$rootScope.message = err.data.message;
						}
					);
			};

			$scope.convertKelvinToCelsius = function (value) {
				return convertKelvinToCelsius.convert(value);
			};
		}
	}
});