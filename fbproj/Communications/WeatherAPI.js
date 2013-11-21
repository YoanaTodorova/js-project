

function getWeatherProperties(country, city, callback) {

	$.ajax({
		url: "http://api.wunderground.com/api/084761d2547e44e4/geolookup/conditions/q/" + country + "/" + city + ".json",
		dataType: "jsonp",
		success: function (parsed_json) {
			var location = parsed_json['current_observation']['display_location']['full'];
			var temp_c = parsed_json['current_observation']['temp_c'];
			var picture = parsed_json['current_observation']['icon_url'];
			var type = parsed_json['current_observation']['icon'];
			var localTime = parsed_json['current_observation']['local_time_rfc822'];
			callback({
				location: location,
				temperature: temp_c + " °C",
				icon: picture,
				weatherType: type,
				time: localTime
			});
		}
	});
	
};