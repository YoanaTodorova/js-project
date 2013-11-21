
var LocationContentVM = function (data) {
	var self = this;

	self.user = ko.observable(data.loggedInUser());



	self.initialize = function () {
		initializeMap(self.user().current_location.latitude, self.user().current_location.longitude);
	};

	self.onUserChanged = ko.computed(function () {
		self.user(data.loggedInUser());
			(function () {
				updateMap(self.user().current_location.latitude, self.user().current_location.longitude);
			} ());
	});
	return self;
};