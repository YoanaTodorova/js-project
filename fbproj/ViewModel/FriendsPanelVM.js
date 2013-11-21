
var ContextMenu = {
	show: {
		eventHandler: function (friendID) {
			var friend;
			ko.utils.arrayForEach(this.friends(), function (fr) {
				if (fr.uid == friendID) friend = fr;
			});
			this.showFriend(friend);
		}
	},
	sendEmail: {
		eventHandler: function (friendID) {

			var msg = {};

			msg.MessageBody = "message content";

			var DTO = { 'message': msg };

			$.ajax({
				type: "POST",
				url: "Main.aspx/TestMethod",
				data: JSON.stringify(DTO),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function () {
					console.log("success");
				},
				error: function () {
					console.log("error");
				}
			});
		}
	},
	items: {
		show: {
			name: "Show friend"
		},
		sendEmail: {
			name: "Send email"
		}
	}
};

var FriendsPanelVM = function (data) {
	var self = this;

	self.friends = ko.observableArray();
	self.shownUserInContentArea = ko.observable(data.loggedInUser);

	self.prevSelectedFriend = null;

	self.prevOneClickedFriend = null;

	self.query = ko.observable("");

	self.showFriend = function (selectedFriend) {
		if (!data.contentAreaShown()) {
			data.showContentArea();
		}
		$("#container").slideUp(300, function () {
			data.onFriendSelected(selectedFriend);
		});
		$("#container").slideDown(900);
	};

	self.changeShownUser = ko.computed(function () {
		self.shownUserInContentArea(data.shownUser());
	});

	self.colorSelectedFriend = ko.computed(function () {
		if (self.shownUserInContentArea().uid == data.loggedInUser.uid) {
			if (self.prevSelectedFriend) {
				self.prevSelectedFriend.className = "";
			}
			return;
		}
		if (self.prevSelectedFriend) {
			self.prevSelectedFriend.className = "";
		}

		var currentFriend = document.getElementById(self.shownUserInContentArea().uid);
		currentFriend.className = "selectedFriend";
		self.prevSelectedFriend = currentFriend;
	});

	self.initialize = function () {
		var friendID;
		$.contextMenu({
			selector: '.context-menu-one',
			build: function (trigger, event) {
				friendID = trigger.attr("id");

				if (self.prevOneClickedFriend) {
					self.prevOneClickedFriend.css("background-color", "rgb(255,255,255)");
				}
				self.prevOneClickedFriend = trigger;
				self.prevOneClickedFriend.css("background-color", "rgb(51,153,255)");

				//trigger.className = "oneClickedFriend";
				//console.log("trigger, e: ", trigger, event);
			},
			callback: function (chosenItem, options) {
				eval("ContextMenu." + chosenItem + ".eventHandler.call(self,friendID)");

				//console.log("key and options: ", chosenItem, options);
			},
			items: ContextMenu['items']
		});

		$("#friendsPanel").slideDown(900);
	};

	self.filterFriends = ko.computed(function () {
		if (self.query().length > 0) {
			$.each(data.FBfriends, function (index, friend) {
				if (friend.name.toLowerCase().indexOf(self.query().toLowerCase()) == -1) {
					if (self.friends.indexOf(friend) != -1) {
						self.friends.remove(friend);
					};
				}
				else {
					if (self.friends.indexOf(friend) == -1) {
						self.friends.push(friend);
					}
				}
			});
		}
		else {

			self.friends.removeAll();
			$.each(data.FBfriends, function (index, friend) {
				self.friends.push(friend);
			});
		}
	});

	self.clearQueryField = function () {
		self.query("");
	};



	return self;
};