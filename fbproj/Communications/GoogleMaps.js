var map;

function initializeMap(latitude, longitude) {
	var mapOptions = {
		zoom: 11,
		center: new google.maps.LatLng(latitude, longitude),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
};

function updateMap(latitude, longitude) {
	if (map) {
		var latLng = new google.maps.LatLng(latitude, longitude);
		map.setCenter(latLng);
	}
};