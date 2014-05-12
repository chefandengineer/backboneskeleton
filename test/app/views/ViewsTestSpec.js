define(function(require) {
  var searchboxview = require('searchboxview');
  var foodtruckcollection = require('foodtruckcollection');
  var expect = require('chai').expect;

  describe('Views', function() {
    describe('Search Box View', function() {
    	beforeEach(function(){
            this.searchboxview = new searchboxview();
    	})
    	describe("search box should render as a <input> item",function(){
            it("Should defaults truck name to an empty string",function(){
                expect(this.searchboxview.render().el.nodeName).to.deep.equal("input");    
            })
    	}) 
    });
  }); 
});
