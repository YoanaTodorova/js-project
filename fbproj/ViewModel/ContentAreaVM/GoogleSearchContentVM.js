
var GoogleSearchContentVM = function (data) {
	var self = this;

	self.user = ko.observable(data.loggedInUser());

	self.initialize = function () {
		google.load("search", "1", { callback: initializeGoogleSearch });
		
	};

	self.onUserChanged = ko.computed(function () {
		self.user(data.loggedInUser());
		updateGoogleSearch(self.user().name);
	});

	return self;
};