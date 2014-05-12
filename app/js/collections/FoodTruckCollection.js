define([
  'jquery',
  'underscore',
  'backbone',
  'models/FoodTruckModel'
], function($, _, Backbone, FoodTruckModel){
  var FoodTruckCollection = Backbone.Collection.extend({
    model: FoodTruckModel,
    url: 'http://peaceful-island-7525.herokuapp.com:8080/foodtrucks'
  });
  return FoodTruckCollection;
});
