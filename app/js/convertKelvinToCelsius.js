(function () {
	'use strict';

	angular
		.module('testingAngularApp')
		.factory('convertKelvinToCelsius', [
			function utilsService() {
				return {
					convert: function(value){
						return Math.round(value - 273);	
					}
				};
			}]);
})();