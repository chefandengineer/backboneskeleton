define(function(require) {
  var mainview = require('MainView');
  var expect = require('chai').expect;
  //var sinon = require('sinon');

  describe('Views', function() {
    beforeEach(function(){
        this.mainview = new mainview();
        this.mainview = this.mainview.render();
        this.searchBoxView = this.mainview.searchBoxView;
        this.searchResultListView = this.mainview.searchResultListView;
        this.collection = this.searchResultListView.collection;
    })
    describe('Main View', function() {
      it("Should render main view to app-container div",function(){
          expect(this.mainview.$el.attr('class')).to.equal("app-container");    
      }) 
      it("Should include a search box container div",function(){
          expect(this.mainview.$el.find('div#searchbox-container')).to.have.length(1);      
      })
      it("Should include a search result list container div",function(){
          expect(this.mainview.$el.find('div#searchresult-list-container')).to.have.length(1);   
      }) 
      it("Should include a map container div",function(){
          expect(this.mainview.$el.find('div#map-container')).to.have.length(1);   
      }) 
    });
    describe('Search Box View', function() {
      it("Should render search box view to searchbox-container div",function(){
          expect(this.searchBoxView.$el.attr('id')).to.equal("searchbox-container");    
      }) 
      it("Should include a <input> text box with id #zipcode",function(){
          expect(this.searchBoxView.$el.find('input#zipcode')).to.have.length(1);    
      }) 
      it("Should include a <button> with id #searchFoodTrucks",function(){
          expect(this.mainview.$el.find('button#searchFoodTrucks')).to.have.length(1);    
      })
    });
    describe('Search Result List View', function() {
      it("Should render search result list view to searchresultlist-container div",function(){
          expect(this.searchResultListView.$el.attr('id')).to.equal("searchresult-list-container");    
      }) 
      it("Should be an empty div initially",function(){
          expect(this.searchResultListView.$el.children()).to.have.length(0);    
      }) 
      it("Should have an empty collection initially",function(){
          expect(this.searchResultListView.collection).to.have.length(0);    
      }) 
    });
  describe('Collection/View Interaction ', function() {
    beforeEach(function(){
      $('input#zipcode').val("94111");
      $('button#searchFoodTrucks').click(); 
      this.fetch_stub = sinon.stub(this.collection, "fetch");
    })
    afterEach(function() {
      this.fetch_stub.restore();
    })
    it("Should update search list view collection when search",function(){
      expect(this.fetch_stub).have.been.calledonce;
      })
    it("Should have an empty collection initially",function(){
          expect(this.searchResultListView.$el.children()).to.have.length(20);    
      })  
    });
  }); 
});
