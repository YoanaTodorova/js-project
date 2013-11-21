
var MainVM = function () {
	var self = this;

	self.loggedInUser = ko.observable();
	self.loginStatus = ko.observable(FacebookLoginStatus.Disconnected);

	self.showFriendsPanel = ko.observable(false);
	self.showContentArea = ko.observable(false);
	self.showCommandPanel = ko.observable(false);
	self.showNetworkArea = ko.observable(false);

	self.contentArea = null;
	self.networkArea = null;
	self.friendsPanel = null;
	self.commandPanel = null;

	self.getFriendsForNetwork = function (callback) {
		callback(self.friendsPanel.friends);
	};

	self.initializeFriendsPanel = function () {
		FacebookCommunication().getMyFriends(function (friendData) {//and get friends list
			if (friendData) {
				var data = {
					FBfriends: friendData,
					onFriendSelected: self.contentArea.friendSelected,
					loggedInUser: self.loggedInUser(),
					shownUser: self.contentArea.user,
					contentAreaShown: self.showContentArea,
					showContentArea: self.onContentAreaChosen
				};
				function helper(callback) {
					self.friendsPanel = new FriendsPanelVM(data);
					self.showFriendsPanel(true);
					self.showContentArea(true);

					callback();
				};
				helper(function () {
					self.friendsPanel.initialize();
				});
			}
			else {
				console.log("Failed to get friends list")
			}
		});
	};

	self.initializeCommandPanel = function () {
		var functions = {
			onLogin: self.loginAndHandleResponse,
			onLogout: self.logoutAndHandleResponse,
			onFacebookNetworkChosen: self.onFacebookNetworkChosen
		};
		self.commandPanel = new CommandPanelVM(functions);
		self.showCommandPanel(true);
		self.commandPanel.initialize(self.loginStatus() === FacebookLoginStatus.Connected);
	};

	self.initializeContentArea = function () {
		FacebookCommunication().getLoggedInUserInfo(function (loggedInUser) {
			self.loggedInUser(loggedInUser);
			var data = {
				loggedInUser: self.loggedInUser(),
				getFriends: self.getFriendsForNetwork
			};
			self.contentArea = new ContentAreaVM(data);
			self.contentArea.initialize();

		});
	};

	self.initializeNetworkArea = function () {
		var data = {
			getFriends: self.getFriendsForNetwork,
			showContentArea: self.onContentAreaChosen
		};
		self.networkArea = new FacebookNetworkVM(data);
	};

	self.initialize = function (FBresponse) {
		self.loginStatus(FBresponse.authResponse ? FacebookLoginStatus.Connected : FacebookLoginStatus.Disconnected);
		console.log("login status: ", self.loginStatus());

		self.initializeCommandPanel();

		if (self.loginStatus() === FacebookLoginStatus.Disconnected) {
			self.loginAndHandleResponse();
		}
		else {
			self.initializeFriendsPanel();
			self.initializeContentArea();
			self.initializeNetworkArea();
			self.commandPanel.changeLogButton(LogButton.Connected);
		}

	};

	self.loginAndHandleResponse = function () {
		FacebookCommunication().login(function (response) {
			if (response.status === "connected") {
				self.loginStatus(FacebookLoginStatus.Connected);

				self.initializeFriendsPanel();
				self.initializeContentArea();
				self.initializeNetworkArea();
				self.commandPanel.changeLogButton(LogButton.Connected);
			}
		});
	};

	self.logoutAndHandleResponse = function () {
		FacebookCommunication().logout(function () {
			self.showFriendsPanel(false);
			self.friendsPanel = null;
			self.showContentArea(false);
			self.contentArea = null;

			self.loginStatus(FacebookLoginStatus.Disconnected);
			self.commandPanel.changeLogButton(LogButton.Disconnected);
		});
	};

	self.onFacebookNetworkChosen = function () {
		self.showContentArea(false);
		self.showNetworkArea(true);
		self.networkArea.initialize();
	};

	self.onContentAreaChosen = function () {
		self.showNetworkArea(false);
		self.showContentArea(true);
	};

	return self;
};

