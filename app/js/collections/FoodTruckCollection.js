define([
  'jquery',
  'underscore',
  'backbone',
  'models/FoodTruckModel'
], function($, _, Backbone, FoodTruckModel){
  var FoodTruckCollection = Backbone.Collection.extend({
    model: FoodTruckModel,
    url: 'http://localhost:8888/foodtrucks'
  });
  return FoodTruckCollection;
});
