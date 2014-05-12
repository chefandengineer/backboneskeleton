define([
  'jquery',
  'underscore',
  'backbone',
  'collections/FoodTruckCollection',
  'text!../../../templates/search/searchResultListTemplate.html',
  'views/map/MapView',
  'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA5B6vFUisZ8oEobVQP5W9B_UZRFz68ALU&sensor=false'
], function($, _, Backbone, FoodTruckCollection, searchResultListTemplate, MapView){

  var SearchResultListView = Backbone.View.extend({
    el: '#searchresult-list-container',
    events : {
      'click .truckName' : 'onFoodTruckClicked'
    },
    initialize : function(){
        this.listenTo(Backbone,'SearchBoxView:changed',this.getFoodTrucks);
        this.listenTo(this.collection,"reset",this.render);
    },
    render: function () {
      if (this.collection && this.collection.length > 0){
        $(this.el).html(_.template(searchResultListTemplate, {foodtrucks: this.collection.models, _:_}));
      } 
      return this;
    },
    onFoodTruckClicked: function(ev) {
      var id;
      if(ev.currentTarget && ev.currentTarget.innerText){
        id = ev.currentTarget.innerText.split(".")[0];
      }
      Backbone.trigger('SearchResultListView:foodTruckClick',id);
    }
  });
  return SearchResultListView;
});
