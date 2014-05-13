// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  baseUrl : "docs/js/",
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
    backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
    async : 'libs/require/async',
    bootstrap : 'libs/bootstrap/bootstrap.min',
    text: 'libs/require/text',
    templates: '../templates',
    //collections
    foodtruckcollection : 'collections/FoodTruckCollection',

  }

});

require([
  'router/MainRouter'
], function(MainRouter){
  
  MainRouter.initialize();

});
