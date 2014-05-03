define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var UserModel = Backbone.Model.extend({
      url: 'http://localhost:8888/users'
      //url: 'http://nationalpark-mongodb.jit.su/messages'
  });
  return UserModel;
});
