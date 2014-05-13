var dataDir = "./data.json";
var fs = require('fs')
var mongoose = require('mongoose/');
var restify = require('restify');  
var mongoURI = 'mongodb://heroku_app24825494:j03hj9n6hdtgvmpvdq6qi641a2@ds037478.mongolab.com:37478/heroku_app24825494';
//var mongoURILocal = 'mongodb://localhost/nationalpark';

console.log("connecting");
var db = mongoose.connect(mongoURI);
var Schema = mongoose.Schema;  
console.log("connected");

var FoodTruckSchema = new Schema({
  truckName : String,
  locationId : Number,
  locationDesc : String,
  address : String,
  foodItems : String,
  latitude : Number,
  longtitude : Number 
})
mongoose.model('FoodTruck',FoodTruckSchema);
var FoodTruckMongooseModel = mongoose.model('FoodTruck');
// FoodTruckMongooseModel.remove({}, function(err) { 
//    console.log('collection removed') 
// });
var insertData = function(err,data){
	var record;
	var i;
	var truckName;
	var locationId;
  	var locationDesc;
  	var address;
  	var foodItems;
  	var latitude;
  	var longtitude; 
  	var totalRecords = 0;

	if (err) throw err;
	data = JSON.parse(data);
	data = data.data;
	//console.log(data.data[1]);
	for (i = data.length - 1; i >= 0; i--) {
		record = data[i];
		var FoodTruck = new FoodTruckMongooseModel();
		FoodTruck.locationId = record[4];
		FoodTruck.truckName = record[9];
		FoodTruck.locationDesc = record[12];
		FoodTruck.address = record[13];
		FoodTruck.foodItems = record[19];
		FoodTruck.latitude = record[22];
		FoodTruck.longtitude = record[23];

		FoodTruck.save(function(){
			totalRecords++;
			console.log(totalRecords);
		})
	};
}

fs.readFile(dataDir, 'utf-8',insertData)

