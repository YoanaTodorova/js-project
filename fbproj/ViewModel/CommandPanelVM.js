
var LogButton = {
	Disconnected: {
		title: "Log in",
		event: null
	},
	Connected: {
		title: "Log out",
		event: null
	}
};

var CommandPanelVM = function (functions) {
	var self = this;

	self.logMenu = ko.observable(LogButton.Disconnected);

	self.initialize = function (loggedIn) {
		$("#commandPanel").slideDown(900);
		loggedIn ? self.logMenu(LogButton.Connected) : self.logMenu(LogButton.Disconnected);
		LogButton.Disconnected.event = function () {
			functions.onLogin();
		};
		LogButton.Connected.event = function () {
			functions.onLogout();
		}

	};

	self.onFacebookNetworkChosen = function () {
		functions.onFacebookNetworkChosen();
	};

	self.changeLogButton = function (LogButtonProperty) {
		self.logMenu(LogButtonProperty);
	};

	return self;
};