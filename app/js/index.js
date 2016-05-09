/*
Generate the custom Google Map for the website. See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/

var map, maps; // declares a global map variable
var infowindow;
var google;
var caribbeanData;

function Country(country) {
	this.name = country.name.common;
	this.location = country.latlng;
	this.lat = country.latlng[0];
	this.lng = country.latlng[1];
	this.region = country.region;
	this.capital = country.capital;
	this.url = country.url;
	this.abbr = country.cca3;
	this.marker = Marker(country);
}

var viewModel = function() {

	var self = this;

	this.countries = ko.observableArray([]);

	caribbeanData.forEach(function(country) {
		self.countries.push(new Country(country));
	});

	this.Query = ko.observable('');
	this.searchResults = ko.computed(function() {

		var q = this.Query();

		return this.countries().filter(function(i) {
			i.marker.setVisible(false);
			getInfoWindowEvent();

			if (i.name.toLowerCase().indexOf(q) >= 0) {
				i.marker.setVisible(true);
				return i;
			}
		});
	});

	/* this binds the list results to their map markers.*/
	bounceUp = function(country) {
		google.maps.event.trigger(country.marker, 'click');
	};
};

/*
	Start here! initializeMap() is called when the index.js script is loaded.
*/
function initializeMap() {

	var mapOptions = {
		center: new google.maps.LatLng(18.0651138,-63.202148),
		zoom: 6,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	/* This next line makes `map` a new Google Map JavaScript Object and attaches it to
		<div class="map-canvas">.
	*/
	map = new google.maps.Map(document.querySelector('.map-canvas'), mapOptions);

	infowindow = new google.maps.InfoWindow();


	ko.applyBindings(viewModel);
}

function errorHandling() {
	alert("Google maps failed to load!");
}

/* 	creating function to close all open infowindows. The purpose is to address that when you
	open and infowindow, then use one of the preset filters, the infowindow was not closing.
	By calling getInfoWindowEvent() within the click-binding in the filter button, it closes any open infowindows;
	source: http://stackoverflow.com/questions/2966744/closing-any-open-info-windows-in-google-maps-api-v3
*/
function getInfoWindowEvent() {
	infowindow.close();
}

function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}
/* creates the markers for each result location */
function Marker(country) {
	var name = country.name.common;
	function toggleBounce() {
		if (country.marker.getAnimation() !== null) {
			country.marker.setAnimation(null);
		} else {
			country.marker.setAnimation(google.maps.Animation.BOUNCE);
		}
		setTimeout(function() {
			country.marker.setAnimation(null);
		}, 1450);
	}

	country.marker = new google.maps.Marker({

		map: map,
		name: country.name.common,
		position: {
			lat: country.latlng[0],
			lng: country.latlng[1]
		},
		animation: google.maps.Animation.DROP,
		heading: country.heading
	});

	/* listens for click to make location marker bounce.*/
	country.marker.addListener('click', function() {
		toggleBounce();
		var lat = country.latlng[0];
		var lon = country.latlng[1];
		var apixuReq = 'http://api.apixu.com/v1/current.json?key=4da212f910d14f3a8dc144355162804&q=' + lat + ',' + lon + '';
		// var apixuReq = 'http://api.apixu.com/v1/current.json?key=WRONGda212f910d14f3a8dc144355162804&q=' + lat + ',' + lon + '';
		$.getJSON(apixuReq).done(function(data) {
			var text, icon;
			var url = country.url;
			var rootUrl = getHostName(country.url);
			var flagPath = 'img/flags/' + country.cca3.toLowerCase() + '.svg';
			var flagImg = '<div>' + '<img src="' + flagPath +'" ' + 'width="200"' + 'height="100">' + '</div>';
			var flagDiv = '<figure>' + flagImg + '</figure>';
			var websiteString = 'Gov Website: ' + '<a href="' + country.url + '"> '+ rootUrl + '</a>' + '<br><br>';
			var iconContainer = '<div class="icon-container">' + '<span class="content">'+ text + '</span>' + '<div class="icon">' + '<img src="http://' + icon + '">' + '</div>' + '</div>';
			
			if (!error) {
				console.log(apixuReq);
				console.log(JSON.stringify(data, undefined, 2));
				var text = data.current.condition.text;
				console.log(text);
				var icon = data.current.condition.icon;
			} else if (error) {
				console.log("error code " + error.code + ", " + error.message);
				var text = "Sorry, no weather for " + country.capital + ".";
				var icon = '';
			}
			var contentString = '<div><h3>' + country.name.common + '</h3>' + '<h4>' + country.capital + '</h4>' + flagImg + '<br>' + websiteString + "Today's Weather:" + '<br>' + iconContainer + '</div>';
			infowindow.setContent(contentString);
		});

		// $.getJSON(apixuReq).done(function(data) {
		// 	var error = data.error;
		// 	if (!error) {
		// 		console.log(apixuReq);
		// 		console.log(data);
		// 		var text = data.current.condition.text;
		// 		var icon = data.current.condition.icon;
		// 		var contentString = '<div><strong>' + country.name.common + '</strong><br>' + country.capital +
		// 			'<br>' + '<a href="' + country.url + '">' + country.url + '<br>' + text + ' ' + '<img src="http://' + icon + '">' +
		// 			'</a></div>';
		// 		infowindow.setContent(contentString);
		// 	} else if (error) {
		// 		console.log("error code " + error.code + ", " + error.message);
		// 		var text = "Sorry, no weather for " + country.capital + ".";
		// 		var icon = '';
		// 		var contentString = '<div><strong>' + country.name.common + '</strong><br>' + country.capital +
		// 			'<br>' + '<a href="' + country.url + '">' + country.url + '<br>' + text + ' ' + '<img src="http://' + icon + '">' +
		// 			'</a></div>';
		// 		infowindow.setContent(contentString);
		// 	}
		// });

		infowindow.open(map, this);
	});

	return country.marker;
}