define(function(require) {
  //var foodtruckmodel = require('foodtruckmodel');
  var expect = require('chai').expect;
  var searchboxview = require('searchboxview');
  describe('Models', function() {
    describe('Food Truck Model', function() {
    	beforeEach(function(){
    		this.foodtruckmodel = new foodtruckmodel();
    	})
    	describe("Initialization",function(){
    		it("Should defaults truck name to an empty string",function(){
    			expect(this.foodtruckmodel.get("truckName")).to.deep.equal("");
    		})
    		it("Should defaults location ID to 0",function(){
    			expect(this.foodtruckmodel.get("locationId")).to.deep.equal(0);
    		})
    		it("Should defaults locationDesc to an empty string",function(){
    			expect(this.foodtruckmodel.get("locationDesc")).to.deep.equal("");
    		})
    		it("Should defaults address to an empty string",function(){
    			expect(this.foodtruckmodel.get("address")).to.deep.equal("");
    		})
    		it("Should defaults food items to an empty string",function(){
    			expect(this.foodtruckmodel.get("foodItems")).to.deep.equal("");
    		})
    		it("Should defaults latitude to 0",function(){
    			expect(this.foodtruckmodel.get("latitude")).to.deep.equal(0);
    		})
    		it("Should defaults longtitude to 0",function(){
    			expect(this.foodtruckmodel.get("longtitude")).to.deep.equal(0);
    		})
    	})
      it('Expect ', function() {
      	expect("hello").to.equal("hello");
      });
    });
  }); 
});
