define([
  'jquery',
  'underscore',
  'backbone',
  'text!../templates/mainTemplate.html',
  'collections/FoodTruckCollection',
  'views/map/MapView',
  'views/search/SearchBoxView',
  'views/search/SearchResultListView' 
], function($, _, Backbone, mainTemplate, FoodTruckCollection, MapView, SearchBoxView,SearchResultListView){
  
  var MainView = Backbone.View.extend({
    el : '.app-container',
    render: function () {
			var that = this;
     $(this.el).html(_.template(mainTemplate));
      var searchBoxView = new SearchBoxView();
      this.searchBoxView = searchBoxView.render();
      
      var foodtrucks = new FoodTruckCollection();
      var searchResultListView = new SearchResultListView({
        collection : foodtrucks
      });
      this.searchResultListView = searchResultListView.render();      
      var mapView = new MapView({
        collection : foodtrucks
      });
      this.mapView = mapView.render();
      return this;
		}
	});
  return MainView;
});
