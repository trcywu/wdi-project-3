var Pear = Pear || {};

Pear.map;
Pear.canvas;
Pear.markers = [];
Pear.defaultCenter = {
    lat: 51.506178,
    lng: -0.088369
}
Pear.venueTypes = [
      // "art_gallery",
      "bar"
      // "bowling_alley",
      // "cafe",
      // "casino",
      // "movie_theater",
      // "museum",
      // "night_club",
      // "park",
      // "parking",
      // "restaurant"
]

Pear.defaultCategoryImage = function(category){
    switch(category) {
      case "bar": return "http://esq.h-cdn.co/assets/cm/15/06/54d3cdbba4f40_-_esq-01-bar-lgn.jpg";
      case "restaurant": return "http://www.jungfrau.ch/fileadmin/apps/orte/images/358-alpstube.jpg";
      case "park": return "https://zainabmarnie.files.wordpress.com/2013/03/park-at-night_00450891.jpg";
      case "art_gallery": return "http://www.tylershields.com/images/gallery/art_gallery.jpg";
      case "bowling_alley": return "http://bowling-alleys.regionaldirectory.us/bowling-alley-720.jpg";
      case "cafe": return "http://thetravelingstory.com/wp-content/uploads/2015/11/seniman-coffe.jpg";
      case "casino": return "http://static.designmynight.com/uploads/2014/01/GrosvenorCasino2-optimised.jpg";
      case "movie_theater": return "http://www.phoenix.org.uk/content/uploads/2014/04/Silver-screenings-1.jpg";
      case "museum": return "http://www.britishmuseum.org/images/new_waddesdon_gallery_944x531.jpg";
      case "night_club": return "http://cdn.londonandpartners.com/asset/53f2c1b95a0bb4af0f509dae4c405106.jpg";
      case "parking": return "https://c1.staticflickr.com/3/2754/4457664301_69e4ee6b7d_z.jpg?zz=1";
    }
}

Pear.changeWindowContent = function() {
    var venueImage;
    var venueName = venue.name;
    if ("photos" in venue) {
        venueImage =
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + venue.photos[0].photo_reference + "&sensor=false&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno";
    } else {
        // venueImage = "http://esq.h-cdn.co/assets/cm/15/06/54d3cdbba4f40_-_esq-01-bar-lgn.jpg";
        // console.log("There ain't no photo here.")
        venueImage = Pear.defaultCategoryImage(venue.types[0]);
    }

    if (venue.price_level) {
        var venuePrice = venue.price_level;
    } else {
        var venuePrice = "?";
    }

    if (venue.rating) {
        var venueRating = Pear.starRating(venue.rating);
    } else {
        var venueRating = "Not currently rated!"
    }
    
    if (venue.opening_hours) {
        if (venue.opening_hours == 'true') {
            var venueOpeningHours = "fa fa-check";
        } else {
            var venueOpeningHours = "fa fa-times";
        }
    } else {
        var venueOpeningHours = "?";
    }
    
    if (venue.types[0]) {
        var venueType = venue.types[0];
    } else {
        var venueType = venue.types;
    }
    
    var venueAddress = venue.vicinity;

    // This is for the sliding side bar
    var $panel = $('#slide-panel');
    
    $panel.empty();
    
    $panel.append('<div class="info-box">' +
            '<div><h1 class="venue-name">' + venueName + '</h1></div>' +
            '<p><h3 class="venue-vicinity">' + venueAddress + '</h3></p>' +
            '<div><img src=' + venueImage + ' class="venue-image"></div>' +
            '<p><span class="venue-rating">' + venueRating + '</span></p>' +
            // use div -col sm 6 per box using the bootstrap method to make these boxes instead.
            '<p><div class="venue-price">' + venuePrice + '</div>' +
            '<div class="venue-opening"><i class="' + venueOpeningHours + '"aria-hidden="true"></i></div></p>' +
            '<p><div class="venue-category">' + venueType + '</div>' +
            '<div class="venue-category">' + marker.score + '</div></p>' +
            '</div>');
}

Pear.addInfoWindowForVenue = function(venue, marker) {
    // At this point in time, 'self' is the Pear object:
    // var self = this;

    // var var_infobox_props = {
    //      content: contentString,
    //      disableAutoPan: false,
    //      maxWidth: 0,
    //      pixelOffset: new google.maps.Size(-10, 0),
    //      zIndex: null,
    //      boxClass: "myInfobox",
    //      closeBoxMargin: "2px",
    //      closeBoxURL: "close_sm.png",
    //      infoBoxClearance: new google.maps.Size(1, 1),
    //      visible: true,
    //      pane: "floatPane",
    //      enableEventPropagation: false
    //   };

    google.maps.event.addListener(marker, "click", function() {
        var $panel = $("#slide-panel");

        if ($panel.hasClass("visible") && $panel.html().indexOf(venueName)) {
            Pear.changeWindowContent();
            $panel.removeClass('visible').animate({
                'margin-left': '-300px'
            });
        } else if ($panel.hasClass("visible")) {
            $panel.removeClass("visible").animate({
                "margin-left": "-300px"
            }, null, null, function() {
                Pear.changeWindowContent();
                $panel.addClass("visible").animate({
                    "margin-left": "0px"
                });
            });
        } else {
            Pear.changeWindowContent();
            $panel.addClass('visible').animate({
                'margin-left': '0px'
            });
        }
        return false;
    });

    if ("photos" in venue) {
        // console.log(venue.photos[0].photo_reference);

    }
    //   if (typeof self.var_infobox != "undefined") self.var_infobox.close();
    //   self.var_infobox = new google.maps.InfoWindow({
    //     content: contentString
    //   });
    //
    //   self.var_infobox.open(self.map, this);
    // })

    // var var_infobox = new InfoBox(var_infobox_props);
    //
    // var_infobox.open(self.map, marker)

}

Pear.getMarkerScore = function(types, price, rating) {
    var score = 0;

    switch (types[0]) {
        case "art_gallery":
            if (rating && rating >= 2.5) {
                score = 5;
            } else {
                score = 4;
            }
            break;
        case "bar":
            if (price) {
                score = (price + 1);
            } else if (rating && rating >= 2.5) {
                score = 4;
            } else {
                score = 3;
            }
            break;
        case "bowling_alley":
            score = 3;
            break;
        case "cafe":
            if (rating && rating >= 3.3) {
                score = 4;
            } else if (rating && rating <= 1.6) {
                score = 2;
            } else {
                score = 3;
            }
            break;
        case "casino":
            if (rating && rating >= 2.5) {
                score = 4;
            } else {
                score = 3;
            }
            break;
        case "movie_theater":
            score = 3;
            break;
        case "museum":
            if (rating && rating >= 2.5) {
                score = 5;
            } else {
                score = 4;
            }
            break;
        case "night_club":
            if (price && price === 4) {
                score = 4;
            } else if (rating && rating >= 2.5) {
                score = 4;
            } else {
                score = 2;
            }
            break;
        case "park":
            score = 1;
            break;
        case "parking":
            score = 1;
            break;
        case "restaurant":
            if (price) {
                score = (price + 1);
            } else if (rating && rating <= 1.25) {
                score = 2;
            } else if (rating && rating <= 2.5) {
                score = 3;
            } else if (rating && rating <= 3.75) {
                score = 4;
            } else {
                score = 5;
            }
            break;
    }
    return score;
}

Pear.createMarkerForVenue = function(venue, timeout) {
  var self   = this;
  var latlng = new google.maps.LatLng(venue.geometry.location.lat, venue.geometry.location.lng);
  var image  = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00D900";
  var types  = venue.types;
  var price  = venue.price_level;
  var rating = venue.rating;
  var score  = this.getMarkerScore(types, price, rating);
  var icon   = "./images/map_markers/" + venue.types[0] + "_marker.png";

  var marker = new google.maps.Marker({
    position: latlng,
    map: self.map,
    icon: icon,
    types: types,
    price: price,
    rating: rating,
    score: score,
    animation: google.maps.Animation.DROP
  });

  Pear.markers.push(marker);
  self.addInfoWindowForVenue(venue, marker);
}

// Sets the map on all markers in the array.
Pear.setMapOnAll = function(map) {
    for (var i = 0; i < Pear.markers.length; i++) {
        Pear.markers[i].setMap(map);
    }

}

// Shows any markers currently in the array.
Pear.showMarkers = function() {
    Pear.setMapOnAll(Pear.map);
}

// Removes the markers from the map, but keeps them in the array.
Pear.clearMarkers = function() {
    Pear.setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
Pear.deleteMarkers = function() {
    Pear.clearMarkers();
    Pear.markers = [];
}

Pear.loopThroughVenues = function(data) {
    // Pear.deleteMarkers();
    return $.each(data.results, function(i, venue) {
        Pear.createMarkerForVenue(venue, i * 10);
    });
}

Pear.getVenues = function(lat, lng) {
    // if (!lat || !lng ) return false;
    if (!lat || !lng) {
        return false;
    }
    var self = this;

    Pear.deleteMarkers();

    $.each(Pear.venueTypes, function(i, venueType) {
        return $.ajax({
            type: "GET",
            url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&radius=500&type=" + venueType + "&key=AIzaSyCg9HSSgl7ERpRyl2AxSHZgrwAUoqXWUno"
        }).done(self.loopThroughVenues)
    })
    Pear.resetSlider();
}

Pear.populateMarkersOnDrag = function() {
    google.maps.event.addListener(Pear.map, 'mouseup', function(event) {
        var currentLat = Pear.map.getCenter().lat();
        var currentLng = Pear.map.getCenter().lng();
        Pear.getVenues(currentLat, currentLng);
    });
}

Pear.geocodeAddress = function() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('address').value;

    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status !== google.maps.GeocoderStatus.OK) return alert('Geocode was not successful for the following reason: ' + status);

        var marker = new google.maps.Marker({
            map: Pear.map,
            position: results[0].geometry.location
        });
        marker.setMap(null)

        Pear.map.panTo(marker.position);
        Pear.map.setZoom(16);
        Pear.getVenues(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    });
}

Pear.setupGeocodeSearch = function() {
    var submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', Pear.geocodeAddress);
}

Pear.initMap = function() {
    this.canvas = document.getElementById('canvas-map');

    this.map = new google.maps.Map(this.canvas, {
        minZoom: 11,
        zoom: 14,
        center: Pear.defaultCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        // panControl:true,
        // rotateControl:true,
        // streetViewControl: true,
        styles: [{
            "featureType": "landscape",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 65
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 51
            }, {
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.highway",
            "stylers": [{
                "saturation": -100
            }, {
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.arterial",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 30
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "road.local",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 40
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "transit",
            "stylers": [{
                "saturation": -100
            }, {
                "visibility": "simplified"
            }]
        }, {
            "featureType": "administrative.province",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [{
                "visibility": "on"
            }, {
                "lightness": -25
            }, {
                "saturation": -100
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "hue": "#ffff00"
            }, {
                "lightness": -25
            }, {
                "saturation": -97
            }]
        }]
    });

    // Binds the submit function for the search
    this.setupGeocodeSearch();


    this.addYourLocationButton(Pear.map, Pear.userMarker);


    // Get position sets up the mouseEvent when you drag the map
    this.populateMarkersOnDrag(this.map);
}


Pear.starRating = function(rating){
  var fullStar  = "<i class='fa fa-star'></i>"
  var halfStar  = "<i class='fa fa-star-half-o'></i>";
  var emptyStar = "<i class='fa fa-star-o'></i>"

  var output = [];

  var numberOfFullStars = Math.floor(rating);

  for (i = 0; i < numberOfFullStars; i++){
    output.push(fullStar)
  }

  if (rating % 1 != 0) {
    output.push(halfStar)
  }

  var numberofEmptyStars = ( 5 - output.length)

  for (i = 0; i < numberofEmptyStars; i++){
    output.push(emptyStar)
  }

  var stars = output.join(" ");
  console.log(stars)
  return stars;
}
