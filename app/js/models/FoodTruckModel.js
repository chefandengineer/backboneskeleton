define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var FoodTruckModel = Backbone.Model.extend({
      url: 'http://localhost:8888/foodtrucks',
      //url: 'http://nationalpark-mongodb.jit.su/messages'
      defaults : {
      "truckName" : "",
  		"locationId" : 0,
  		"locationDesc" : "",
  		"address" : "",
  		"foodItems" : "",
  		"latitude" : 0,
  		"longtitude" : 0 
      }
  });
  return FoodTruckModel;
});
