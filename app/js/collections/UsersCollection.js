define([
  'jquery',
  'underscore',
  'backbone',
  'models/UserModel'
], function($, _, Backbone, UserModel){
  var UsersCollection = Backbone.Collection.extend({
    model: UserModel,
      url: 'http://localhost:8888/users'
      //url: 'http://nationalpark-mongodb.jit.su/messages'
  });

  return UsersCollection;
});
