
var Tabs = [
{
	templateName: "Basic",
	title: "Personal Info",
	href: "#tabs-0",
	id: "tabs-0"
},
{
	templateName: "Location",
	title: "Location",
	href: "#tabs-1",
	id: "tabs-1"
},
{
	templateName: "Posts",
	title: "Posts",
	href: "#tabs-2",
	id: "tabs-2"
},
{
	templateName: "Weather",
	title: "Weather",
	href: "#tabs-3",
	id: "tabs-3"
},
{
	templateName: "GoogleSearch",
	title: "Google Web Search",
	href: "#tabs-4",
	id: "tabs-4"
}
];

var ContentAreaVM = function (data, friends) {
	var self = this;

	self.user = ko.observable(data.loggedInUser);
	self.tabPages = ko.observableArray(Tabs);
	self.BasicContent = null;
	self.LocationContent = null;
	self.PostsContent = null;
	self.WeatherContent = null;
	self.GoogleSearchContent = null;

	self.shouldShowCloseButton = ko.computed(function () {
		return self.user().uid != data.loggedInUser.uid;
	});


	self.initialize = function () {
		var localData = {
			loggedInUser: self.user
		};
		self.BasicContent = new BasicContentVM(localData);
		self.LocationContent = new LocationContentVM(localData);
		self.PostsContent = new PostsContentVM(localData);
		self.WeatherContent = new WeatherContentVM(localData);
		self.GoogleSearchContent = new GoogleSearchContentVM(localData);
	};

	self.showViewForSelectedTab = function (data) {
		setTimeout(function () {
			eval("self." + data.templateName + "Content.initialize()");
		}, 0);
	};

	self.friendSelected = function (newFriend) {
		self.user(newFriend);
		$("#tabs").tabs({ active: 0 });
	};

	self.switchViewToLoggedInUser = function () {
		self.friendSelected(data.loggedInUser);
	};

	return self;
};