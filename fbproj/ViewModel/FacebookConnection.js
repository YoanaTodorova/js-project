
FacebookConstants = {
	appId: '484314114994628',
	channelUrl: '//localhost/channel.htm',
	asyncExecute: true,
	useCookie: true
};

window.fbAsyncInit = function () {
	FB.init({
		appId: FacebookConstants.appId,
		channelUrl: FacebookConstants.channelUrl,
		status: FacebookConstants.asyncExecute,
		cookie: FacebookConstants.useCookie,
		xfbml: true,
		oauth: true
	});

	FB.getLoginStatus(function (response) {
		pageLoaded(response);
	});
};

(function (d) {
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) { return; }
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
} (document));