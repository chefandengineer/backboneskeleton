require.config({
  baseUrl : '../app/js/',
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
    backbone: 'libs/backbone/backbone-min', // https://github.com/amdjs
    async : 'libs/require/async',
    bootstrap : 'libs/bootstrap/bootstrap.min',
    text: 'libs/require/text',
    chai : '../../test/lib/chai',
    mocha : '../../test/lib/mocha/mocha',
    foodtruckmodel : 'models/FoodTruckModel',
    searchboxview : 'views/search/SearchBoxView',
    foodtruckcollection : 'collections/FoodTruckCollection'
  },
  shim: {
    'underscore': {
      exports: '_'
    },
    'jquery': {
      exports: '$'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});
 
require(['require', 'chai', 'mocha', 'jquery'], function(require, chai){
  var expect = chai.expect;
  mocha.setup('bdd');
  require([
    '../../test/app/models/FoodTruckModel',
    //'app/views/ViewsTestSpec'
  ], function(require) {
    mocha.run();
  });
 
});