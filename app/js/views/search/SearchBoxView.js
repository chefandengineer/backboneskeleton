define([
  'jquery',
  'underscore',
  'backbone',
  'collections/FoodTruckCollection',
  'text!../../../templates/search/searchBoxTemplate.html',
  'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA5B6vFUisZ8oEobVQP5W9B_UZRFz68ALU&sensor=false'
], function($, _, Backbone, FoodTruckCollection, searchBoxTemplate,GoogleMaps){
  //console.log(MapView);
  var SearchBoxView = Backbone.View.extend({
    el: '#searchbox-container',
    events: {
        'click button[id=searchFoodTrucks]' : "setZipCode" 
    },
    render: function () {
      $(this.el).html(searchBoxTemplate);
      return this;
    },
    setZipCode : function(event) {
      var zip = $("#zipcode").val();
      Backbone.trigger('SearchBoxView:changed',zip);
    }
  });
  return SearchBoxView;
});