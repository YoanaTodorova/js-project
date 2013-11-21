
var BasicContentVM = function (data) {
	var self = this;

	self.user = ko.observable(data.loggedInUser());

	self.onUserChange = ko.computed(function (newUser) {
		self.user(data.loggedInUser());
	});

	self.initialize = function () {
		$("#container").slideDown(900);
		//console.log("in init basic");
	};

	self.showBigPic = function () {
		$(".person-img").hide(500);
		$(".person-img-big").show(500);
	};

	self.showSmallPic = function () {
		$(".person-img-big").hide(500);
		$(".person-img").show(500);
	};

	return self;
};