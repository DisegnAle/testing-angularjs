describe('Testing AngularJs Test Suite', function () {
	// includo il modulo nel test tramite beforeEach			
	beforeEach(module('testingAngularApp', 'templates'));

	describe('Testing AngularJs controller', function () {

		var scope = {},
			ctrl,
			http,
			timout;

		beforeEach(
			// inietta i componenti nel test - in questo caso il controller
			inject(function ($controller, $rootScope, $httpBackend, $timeout) {
				// creo un child scope
				scope = $rootScope.$new();
				ctrl = $controller('testingAngularCtrl', {
					$scope: scope
				});
				http = $httpBackend;
				timout = $timeout;

				expect(scope.destinations).toBeDefined();
				expect(scope.destinations.length).toBe(0);
			})
		);

		afterEach(function () {
			//Cleanup code		
			scope.destinations = [];
			http.verifyNoOutstandingExpectation();
			http.verifyNoOutstandingRequest();
		});


		it('should initialize the title in the scope', function () {
			// definisco cosa l'unità dovrebbe testare
			expect(scope.title).toBeDefined();
			expect(scope.title).toBe('Testing AngularJS Applications');
		});

		it('should add 2 destinations to the destinations list', function () {
			scope.newDestination = {
				city: 'London',
				country: 'England'
			};

			scope.addDestination();

			scope.newDestination = {
				city: 'Frankfurt',
				country: 'Germany'
			};

			scope.addDestination();

			expect(scope.destinations.length).toBe(2);


			expect(scope.destinations[1].city).toBe("Frankfurt");
			expect(scope.destinations[1].country).toBe("Germany");

			// verifico che la prima destinazione non venga sostituita ma solo aggiunta
			expect(scope.destinations[0].city).toBe("London");
			expect(scope.destinations[0].country).toBe("England");

		});

		it('should remove the clicked element from list', function () {
			scope.destinations = [
				{
					city: 'London',
					country: 'England'
				},
				{
					city: 'Frankfurt',
					country: 'Germany'
				}
			]

			scope.removeDestination(0);

			expect(scope.destinations.length).toBe(1);
			expect(scope.destinations[0].city).toBe("Frankfurt");
			expect(scope.destinations[0].country).toBe("Germany")

		});

		it('form inputs should be blank after any submit', function () {
			scope.newDestination = {
				city: 'London',
				country: 'England'
			};

			scope.addDestination();
			expect(scope.newDestination.city).toBe("");
			expect(scope.newDestination.country).toBe("");

		});

		// Spostata in una direttiva
		/*it('it should update the weather for a specific destination', function () {
			scope.destination = {
				city: "Melbourne",
				country: "Australia"
			};

			http.expectGET(
				"http://api.openweathermap.org/data/2.5/weather?q=" + scope.destination.city + "&appid=" + scope.apiKey
			).respond({
				weather: [{
					main: "Rain",
					detail: "Light rain"
				}],
				main: {
					temp: 288
				}
			});

			scope.getWeather(scope.destination);
			http.flush();

			expect(scope.destination.weather.main).toBe("Rain");
		});*/

		// Spostata in una direttiva
		/*it('should remove message after a fixed period of time', function () {
			scope.message = "Error";
			scope.$apply();
			timout.flush();
			expect(scope.message).toBeNull;
		});*/
	});

	describe('Testing AngularJs Filter', function () {
		it("should return only warm destinations", inject(function ($filter) {
			var warmest = $filter("warmestDestinations");
			var destinations = [		
				{city: "London", country: "England", weather:{main: "Rain", temp: 5}},
				{city: "Milan", country: "Italy", weather:{main: "Mist", temp: 12}},
				{city: "Rome", country: "Italy", weather:{main: "Clear", temp: 17}},
				{city: "Catania", country: "Italy", weather:{main: "Rain", temp: 3}},
				{city: "New York", country: "United States", weather:{main: "Clouds", temp: 8}},
				{city: "Miami", country: "United States", weather:{main: "Clouds", temp: 21}}
			];
			
			var warmestDestinations = warmest(destinations, 15);
			expect(warmestDestinations.length).toBe(2);
			expect(warmestDestinations[0].city).toBe("Rome");
			expect(warmestDestinations[1].city).toBe("Miami");
		}));
	});
	
	
	describe('Testing AngularJs Service', function () {
		it("should convert Kelvin To Celsius Temperature", inject(function (convertKelvinToCelsius) {
			var destination = {city: "London", country: "England", weather:{main: "Rain", temp: 294}};
			var newTemp = convertKelvinToCelsius.convert(destination.weather.temp);
			expect(newTemp).toBe(21);
		}));
	});
	
	
	describe('Testing AngularJs Directive', function () {
		var scope,
			template,
			http,
			rootScope,
			timeout,
			isolateScope;
		
		beforeEach(inject(function($compile, $rootScope, $httpBackend, $timeout){
			scope = $rootScope.$new();
			scope.destination = {
				city: "Tokio",
				country: "Japan"
			};
			
			scope.apiKey = "xyz";
			rootScope = $rootScope;
			timeout = $timeout;
			http = $httpBackend;
			
			var element = angular.element(
				'<destination destination="destination" api-key="apiKey" on-remove="remove()"></destination>'
			)
			
			template = $compile(element)(scope);
			scope.$digest;
			isolateScope = element.isolateScope();
		}));
		
		
		it('it should update the weather for a specific destination', function () {
			scope.destination = {
				city: "Melbourne",
				country: "Australia"
			};

			http.expectGET(
				"http://api.openweathermap.org/data/2.5/weather?q=" + scope.destination.city + "&appid=" + scope.apiKey
			).respond({
				weather: [{
					main: "Rain",
					detail: "Light rain"
				}],
				main: {
					temp: 288
				}
			});

			isolateScope.getWeather(scope.destination);
			http.flush();

			expect(scope.destination.weather.main).toBe("Rain");
		});
		
		it('should add a message if no city is found', function () {
			scope.destination = {
				city: "Melbourne",
				country: "Australia"
			};

			http.expectGET(
				"http://api.openweathermap.org/data/2.5/weather?q=" + scope.destination.city + "&appid=" + scope.apiKey
			).respond({});

			isolateScope.getWeather(scope.destination);
			http.flush();

			expect(rootScope.message).toBe("City not found");
		});
		
		it('should add a message when there is a server error', function () {
			scope.destination = {
				city: "Melbourne",
				country: "Australia"
			};

			http.expectGET(
				"http://api.openweathermap.org/data/2.5/weather?q=" + scope.destination.city + "&appid=" + scope.apiKey
			).respond(500);

			isolateScope.getWeather(scope.destination);
			http.flush();

			expect(rootScope.message).toBe("city not found");
		});
				
		it('should remove message after a fixed period of time', function () {
			rootScope.message = "Error";
			rootScope.$apply();
			timeout.flush(1000);
			expect(rootScope.message).toBeNull;
		});
		
		it('should call the parent remove function', function(){
			scope.removeTest = 1;
			scope.remove = function(){
				scope.removeTest++;	
			};
			
			isolateScope.onRemove();
			expect(scope.removeTest).toBe(2);
		});
			
		it('should generate the correct html', function(){
			var templateAsHtml = template.html();
			expect(templateAsHtml).toContain("Tokio, Japan");
		});	
		
		
	});
	
	

});