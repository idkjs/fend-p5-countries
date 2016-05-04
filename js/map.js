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
		map = new google.maps.Map(document.querySelector('.map-canvas'), mapOptions);
	
		infowindow = new google.maps.InfoWindow();
        
        console.log("map loaded");
		// ko.applyBindings(viewModel);
	}

	function errorHandling() {
		alert("Google maps failed to load!");
	}

	// creating function to close all open infowindows. The purpose is to address that when you
	// open and infowindow, then use one of the preset filters, the infowindow was not closing.
	// By calling getInfoWindowEvent() within the click-binding in the filter button, it closes any open infowindows;
	// source: http://stackoverflow.com/questions/2966744/closing-any-open-info-windows-in-google-maps-api-v3
	function getInfoWindowEvent() {
		infowindow.close();
	}