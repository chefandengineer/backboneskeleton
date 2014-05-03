define([
  'jquery',
  'underscore',
  'backbone',
  'models/UserModel',
  'text!templates/guestbook/userFormTemplate.html'
], function($, _, Backbone, UserModel, userFormTemplate){
  
  var UserFormView = Backbone.View.extend({
    el: '.user-form-container',
    render: function () {
      $(this.el).html(userFormTemplate);
      
    },
    events: {
      'click .post-user': 'postUser'
    },
    
    postUser: function() {
      var that = this;

      console.log("posting user from UserFormView")

      var userModel = new UserModel();
            
      userModel.save( { user: $('.user').val() }, {
        
        success: function () {
          console.log("UserFormView succes " + userModel.get('user') )
          
          that.trigger('postMessage');
        },
        error: function () {
          console.log("UserFormView error on save");
        }

      });
    }
  });

  return UserFormView;

});