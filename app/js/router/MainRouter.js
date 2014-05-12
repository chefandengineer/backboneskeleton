define([
  'jquery',
  'underscore',
  'backbone',
  'views/MainView'
], function ($, _, Backbone, MainView, CabinView) {
  
  var MainRouter = Backbone.Router.extend({
    routes: {
      '*actions': 'defaultAction',
      'messages': 'showMessageAboutMongo', // All urls will trigger this route
      'about': 'showAbout' 
    }
  });

  var initialize = function(){
    var router = new MainRouter();
    console.log("MainRouter / initialize");
		router.on('route:defaultAction', function (actions) {
        var mainView = new MainView();
        mainView.render();
		});
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
