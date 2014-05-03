define([
  'jquery',
  'underscore',
  'backbone',
  'collections/MessagesCollection',
  'text!templates/guestbook/guestbookSecListTemplate.html'
], function($, _, Backbone, MessagesCollection, guestbookListTemplate){
  var GuestbookListView = Backbone.View.extend({
    el: '.guestbook-list-container1',
    render: function () {
      var that = this;
     
      /* no messages at the start */

      that.getMessages();
    },

    getMessages: function(){

      var that = this;

      var messages = new MessagesCollection();

      messages.fetch({
        success: function(messages) {
          $(that.el).html(_.template(guestbookListTemplate, {messages: messages.models, _:_}));
        },
        error: function(response) {
            console.log(response, "GuestbookList error!");
        }
      });

    }

  });
  return GuestbookListView;
});
