
var PostsContentVM = function (data) {
	var self = this;

	self.user = ko.observable(data.loggedInUser());

	self.onUserChange = ko.computed(function () {
		self.user(data.loggedInUser());
	});

	self.initialize = function () {
		//console.log("postove: ", self.user().posts);
	};

	return self;
};