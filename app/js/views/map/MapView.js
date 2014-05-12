define([
  'jquery',
  'underscore',
  'backbone',
  'collections/FoodTruckCollection',
  'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA5B6vFUisZ8oEobVQP5W9B_UZRFz68ALU&sensor=false',
  'text!../../../templates/map/markerInfoTemplate.html'
], function($, _, Backbone,FoodTruckCollection,GoogleMap,markerInfoTemplate){
  var markers = [];
  var infowindow = new google.maps.InfoWindow();
  var ZOOM_LEVEL = 12;
  var SF_LAT = 37.774929500;
  var SF_LNG = -122.41941550;
  var lat;
  var lng;
  var map;


  var MapView = Backbone.View.extend({
    el: '#map-container',
    
    initialize : function(){
      this.listenTo(Backbone,'SearchBoxView:changed',this.searchFoodTrucks);
      this.listenTo(this.collection,"reset",this.displayMarkers);
      this.listenTo(Backbone,'SearchResultListView:foodTruckClick',this.showMarker);
      //overwrite google maps to clear previous marker
      google.maps.Map.prototype.clearMarkers = function() {
          for(var i=0; i < markers.length; i++){
            markers[i].setMap(null);
          }
          markers.length = 0;
      };
    },

    render: function () {
        var initialLocation = new google.maps.LatLng(SF_LAT,SF_LNG);
        var mapOptions = {
          center: initialLocation,
          zoom: ZOOM_LEVEL
        };
        map = new google.maps.Map(document.getElementById("map-container"),
            mapOptions);
        var marker = new google.maps.Marker({
            position: initialLocation,
            map: map
        });
        markers.push(marker);
      return this;
    },

    searchFoodTrucks : function(zip){
      var geocoder = new google.maps.Geocoder();
      var foodtrucks = this.collection;
      if(zip){
        geocoder.geocode({
        'address': zip
        }, function(results, status) {
          lat = results[0].geometry.location.lat();
          lng = results[0].geometry.location.lng();
          foodtrucks.fetch({
            data : $.param({'lat' : lat, 'lng' : lng}),
            reset : true,
            success : function(foodtrucks){
              console.log("foodtrucks fetched");
            },
            failure : function(){
              alert("Sorry, we cannot get the food trucks now");
            }
          })
        });
      }
    },

    displayMarkers : function(){
      var marker;
      var location;
      var center = new google.maps.LatLng(lat,lng);
      var bounds = new google.maps.LatLngBounds();
      var foodtrucks = this.collection.models;
      bounds.extend(center);
      map.setCenter(center);
      map.clearMarkers();

      for (var i = 0; i < foodtrucks.length; i++) {
        var foodtruck = foodtrucks[i];
        location = new google.maps.LatLng(foodtruck.get("latitude"),foodtruck.get("longtitude"));
        bounds.extend(location);
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(_.template(markerInfoTemplate,{foodtruck : foodtrucks[i], _:_}));
          infowindow.open(map, marker);
        }
      })(marker, i));
             google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
        return function() {
          infowindow.setContent(_.template(markerInfoTemplate,{foodtruck : foodtrucks[i], _:_}));
          infowindow.open(map, marker);
        }
      })(marker, i));
      }; 
      map.fitBounds(bounds);
    },
    showMarker : function(id){
      var index = id - 1;
      var marker = markers[index];
      var foodtruck = this.collection.models[index];
      infowindow.close();
      infowindow.setContent(_.template(markerInfoTemplate,{foodtruck : foodtruck, _:_}));
      infowindow.open(map,marker);
    } 
  });
  return MapView;
});