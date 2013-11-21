
var FacebookLoginStatus = {
	Connected: "Connected",
	Disconnected: "Disconnected"
};

var DefaultLocation = {
	city: "Sofia",
	country: "Bulgaria",
	id: "106013482772674",
	latitude: "42.6833",
	longitude: "23.3167",
	name: "Sofia, Bulgaria",
	state: "Grad Sofiya",
	zip: ""
};

var DefaultEducation = [
{
	school: {
		id: "110520008969461",
		name: "ПМГ 'Св. Климент Охридски'"
	},
	type: "High School"
},
{
	concentration: [{
		id: "242639902415307",
		name: "Компютърни науки"
	}],
	school: {
		id: "203310713038692",
		name: "Sofia University"
	},
	type: "College"
}];

var DefaultWork = [{
	employer: {
		id: "30016422584",
		name: "Komfo"
	},
	position: {
		id: "108480125843293",
		name: "Web Developer"
	}
}];

function FacebookCommunication() {
	var self = this;

	self.getLoggedInUserInfo = function (callback) {
		if (FB) {
			FB.api({
				method: 'fql.query',
				query: "SELECT uid, name, pic, pic_square, current_location, hometown_location, work, education FROM user WHERE uid = me()"
			}, function (data) {
				var user = data[0];

				if (!user.current_location) {
					user.current_location = DefaultLocation;
				}
				self.getWallPosts(user.uid, function (posts_data) {
					user.posts = posts_data;
				});
				callback(user);
			});
		}
	};

	self.login = function (callback) {
		if (FB) {
			FB.login(function (response) {
				callback(response);
			}, { scope: 'user_education_history, friends_education_history, friends_work_history, publish_actions, user_location, friends_location, user_hometown, friends_hometown, friends_photos, read_stream, manage_notifications' });
		}
	};

	self.logout = function (callback) {
		FB.logout(function (response) {
			console.log('Bye bye');
			callback();
		});
	};

	self.getMyFriends = function (callback) {

		FB.api({
			method: 'fql.query',
			query: "SELECT uid, name, pic, pic_square, current_location, hometown_location, work, education FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me() LIMIT 70)"
		},
        function (data) {
        	$.each(data, function (index, friend) {
        		!friend.current_location ? friend.current_location = DefaultLocation : "";
        		!friend.hometown_location ? friend.hometown_location = DefaultLocation : "";
        		friend.education.length != 2 ? friend.education = DefaultEducation : "";
        		self.getWallPosts(friend.uid, function (posts_data) {
        			friend.posts = posts_data;
        		});
        	});
        	callback(data);
        });
	};

	self.getWallPosts = function (userID, callback) {
		FB.api({
			method: 'fql.query',
			query: "SELECT post_id, message, created_time, actor_id, permalink, source_id, type FROM stream WHERE source_id=" + userID + " AND type=46"
		},
		function (data) {
			callback(data);
		});
	};

	self.getNotifications = function () {
		FB.api({
			method: 'fql.query',
			query: "SELECT title_text, is_unread, created_time, object_type  FROM notification WHERE recipient_id = me()"
		},
		function (data) {
			console.log(data);
		});
	};

	self.getMutualFriends = function (friendID, callback) {
		FB.api('/me/mutualfriends/' + friendID, { fields: 'id, name, picture' }, function (data) {
			//console.log("mutual frs maybe: ", data);
			callback(data);
		});
	};

	return self;
};
