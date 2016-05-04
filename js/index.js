/*
This is the fun part. Here's where we generate the custom Google Map for the website.
See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/

var map;    // declares a global map variable
var infowindow;
var google;
var caribbeanData;
console.log(caribbeanData[0]);

function Country(country) {
	this.name = country.name.common;
	this.location = country.latlng;
	this.lat = country.latlng[0];
	this.lng = country.latlng[1];
	this.region = country.region;
	this.capital = country.capital;
	this.url = country.url;
	this.marker = Marker(country);
}

var viewModel = function() {

	var self = this;

	this.countries = ko.observableArray([]);

	caribbeanData.forEach(function(country){
		self.countries.push(new Country(country));
	});

	this.Query = ko.observable('');
	this.searchResults = ko.computed(function() {

	    var q = this.Query();

	    return this.countries().filter(function(i){
	    	i.marker.setMap(null);
	    	getInfoWindowEvent();
	    	
	    	if (i.name.toLowerCase().indexOf(q) >= 0) {
	    		i.marker.setMap(map);
	    		return i;
			}
	    });
	});

	// this binds the list results to their map markers.
	bounceUp = function(country) {
		google.maps.event.trigger(country.marker, 'mouseover');
	};
};

// /*
// Start here! initializeMap() is called when page is loaded.
// */
function initializeMap() {

	var mapOptions = {
        // center: new google.maps.LatLng(18.4803633,-70.0169392), //DR
        // center: new google.maps.LatLng(18.5790242,-72.3544686), //PAP
        center: new google.maps.LatLng(17.9709108,-76.8425598), //kingston
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  	// This next line makes `map` a new Google Map JavaScript Object and attaches it to
  	// <div id="map">, which is appended as part of an exercise late in the course.
  	map = new google.maps.Map(document.querySelector('#map-canvas'), mapOptions);
  
  	infowindow = new google.maps.InfoWindow();

  	ko.applyBindings(viewModel);

} function errorHandling() {
      alert("Google maps failed to load!");
	}

// creating function to close all open infowindows. The purpose is to address that when you
// open and infowindow, then use one of the preset filters, the infowindow was not closing.
// By calling getInfoWindowEvent() within the click-binding in the filter button, it closes any open infowindows;
// source: http://stackoverflow.com/questions/2966744/closing-any-open-info-windows-in-google-maps-api-v3
function getInfoWindowEvent() {
    infowindow.close();
}

function Marker(country) {
	var text, icon;
	
	function toggleBounce() {
		if (country.marker.getAnimation() !== null) {
		country.marker.setAnimation(null);
		} else {
		country.marker.setAnimation(google.maps.Animation.BOUNCE);
		}
		setTimeout(function(){country.marker.setAnimation(null);}, 1450);
	}

	country.marker = new google.maps.Marker({
		
		map: map,
		name: country.name,
		position: {lat: country.latlng[0], lng: country.latlng[1]},
		animation: google.maps.Animation.DROP,
		heading: country.heading
	});
	console.log(country.marker);
	// listens for click to make location marker bounce.
	country.marker.addListener('mouseover', function() {
		toggleBounce();
		var lat = country.latlng[0];
		var lon = country.latlng[1];	
        var apixuReq = 'http://api.apixu.com/v1/current.json?key=4da212f910d14f3a8dc144355162804&q='+ lat + ',' + lon +'';
		console.log(apixuReq);
		$.getJSON(apixuReq).done(function(data){
			// var apixuReq = 'http://api.apixu.com/v1/current.json?key=4da212f910d14f3a8dc144355162804&q='+ lat + ',' + lon +'';
	        var text = data.current.condition.text;
	        var icon = data.current.condition.icon;
	        var contentString = '<div><strong>' + country.name.common + '</strong><br>' + country.capital +
			 '<br>' + '<a href="'+country.url+'">' + country.url + '<br>' + text + ' ' + '<img src="http://'+icon+'">' +
			 '</a></div>';
			 console.log(contentString);
	        infowindow.setContent(contentString);
	    });
		
		infowindow.open(map, this); 
	});

		// makeInfoWindow(apixuReq, function(){
		// 	setTimeout(function(){infowindow.open(map,this);}, '100');
		// });
		// google.maps.event.addListener(country.marker, 'click');
		return country.marker;
};

// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);
