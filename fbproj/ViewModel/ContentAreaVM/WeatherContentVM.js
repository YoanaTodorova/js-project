
var WeatherContentVM = function (data) {
	var self = this;

	self.user = ko.observable(data.loggedInUser());
	self.weather = ko.observable({});

	self.initialize = function () {
		getWeatherProperties(self.user().current_location.country, self.user().current_location.city, function (weather) {
			self.weather(weather);
			//console.log("vremeto dnes: ", weather);
		});

	};

	self.onUserChanged = ko.computed(function (newUser) {
		self.user(data.loggedInUser());
		self.initialize();
	});

	return self;
};