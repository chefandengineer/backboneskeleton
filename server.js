
/**
  Restify server that serves both static files and service api
**/
var fs = require('fs');
var httpServer = require('http'); // might not needed 
var path = require('path');
var connect = require('connect');
//mongo server
var mongoose = require('mongoose/');
var restify = require('restify');  
var config = require('./config');

var mongodbPort = process.env.PORT || 8080;


var sendHTML = function( filePath, contentType, response ){
  path.exists(filePath, function( exists ) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}

var getFilePath = function(url) {
  var filePath = './app' + url;
  if (url == '/' ) { 
      filePath = './app/index.html';
  } else {
     filePath =  filePath.replace("/docs","");
  }
  return filePath;
}

var getContentType = function(filePath) {
   var extname = path.extname(filePath);
   var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    return contentType;
}

var onHtmlRequestHandler = function(request, response) {
  //serving static data
  var filePath = getFilePath(request.url);
  var contentType = getContentType(filePath);
  sendHTML(filePath, contentType, response); 
}


var mongoURI = ( process.env.PORT ) ? config.creds.mongoose_auth_heroku : config.creds.mongoose_auth_local;

db = mongoose.connect(mongoURI),
Schema = mongoose.Schema;  

var mongodbServer = restify.createServer({
    formatters: {
        'application/json': function(req, res, body){
            if(req.params.callback){
                var callbackFunctionName = req.params.callback.replace(/[^A-Za-z0-9_\.]/g, '');
                return callbackFunctionName + "(" + JSON.stringify(body) + ");";
            } else {
                return JSON.stringify(body);
            }
        },
        'text/html': function(req, res, body){
            return body;
        }
    }
});

mongodbServer.use(restify.bodyParser());
mongodbServer.use(restify.queryParser());


//FoodTruck Schema
var FoodTruckSchema = new Schema({
  longtitude : Number, 
  truckName : String,
  locationId : Number,
  locationDesc : String,
  address : String,
  foodItems : String,
  latitude : Number
})

mongoose.model('FoodTruck',FoodTruckSchema);
var FoodTruckMongooseModel = mongoose.model('FoodTruck');


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

var getFoodTrucks = function(req, res, next) {
  var lat;
  var lng;
  console.log(req);

  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
  
  if( 'OPTIONS' == req.method ) {
    res.send( 203, 'OK' );
  }
  
  console.log("mongodbServer getFoodTrucks");
  //if lat and lng provided, get corresponding list
  if(req && req.query && req.query.lat && req.query.lng) {
    console.log(req.query);
    lat = req.query.lat;
    lng = req.query.lng;

    console.log("Looking for food trucks near lat : " + lat + " , lng : " + lng);
    FoodTruckMongooseModel.find().limit(600).execFind(function (arr,data) {
      console.log(data);
      var distances = {};
      for (var i = data.length - 1; i >= 0; i--) {
        var foodtruck = data[i];
        var distance = getDistanceFromLatLonInKm(lat,lng,foodtruck.latitude,foodtruck.longtitude);
        var id = data[i]._id;
        distances[id] = distance;
      }
      console.log(distances);
      data.sort(function(a,b){
        var id1 = a._id;
        var id2 = b._id;
        var distance1 = distances[id1];
        var distance2 = distances[id2];
      //  console.log(distance1 + " compare to " + distance2);
        if(distance1 < distance2) return -1;
        if(distance1 > distance2) return 1;
        return 0;
     });
    res.send(data.slice(0,20));
  }); 
  } else {
    console.log("No zip code returned, returning random 20 food trucks");
    FoodTruckMongooseModel.find().limit(20).sort('truckName', -1).execFind(function (arr,data) {
      res.send(data);
    });
  }
}


mongodbServer.listen(mongodbPort, function() {
  
  var consoleMessage = '\n San Francisco Food Truck Application! Server Started';
  consoleMessage += '+++++++++++++++++++++++++++++++++++++++++++++++++++++ \n\n'  
 
  console.log(consoleMessage, mongodbServer.name, mongodbServer.url);

});

//Rest APIs
//food trucks, get food trucks 
mongodbServer.get('/foodtrucks',getFoodTrucks);
//static files 
mongodbServer.get('/',onHtmlRequestHandler);
mongodbServer.get('/docs/.*',onHtmlRequestHandler);




