
//http server
var fs = require('fs');
var httpServer = require('http');
var path = require('path');
var connect = require('connect');
//mongo server
var mongoose = require('mongoose/');
var restify = require('restify');  

var config = require('./config');


//var httpPort = process.env.PORT || 8080;
var mongodbPort = process.env.PORT || 8080;


var sendHTML = function( filePath, contentType, response ){

  console.log('sendHTML: ' + filePath) ;

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

  console.log('onHtmlRequestHandler... request.url: ' + request.url) ;

  var filePath = getFilePath(request.url);
  var contentType = getContentType(filePath);

  console.log('onHtmlRequestHandler... getting: ' + filePath) ;
  sendHTML(filePath, contentType, response); 
}

//httpServer.createServer(onHtmlRequestHandler).listen(httpPort); 

////////////////////////////////////////////////////// MONGODB - saves data in the database and posts data to the browser

var mongoURI = ( process.env.PORT ) ? config.creds.mongoose_auth_local : config.creds.mongoose_auth_local;

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

// Create a schema for our data
var MessageSchema = new Schema({
  message: String,
  date: Date
});


//User 
var UserSchema = new Schema({
  user : String
})

//FoodTruck Schema
var FoodTruckSchema = new Schema({
  truckName : String,
  locationId : Number,
  locationDesc : String,
  address : String,
  foodItems : String,
  latitude : Number,
  longtitude : Number 
})

// Use the schema to register a model
mongoose.model('Message', MessageSchema); 
var MessageMongooseModel = mongoose.model('Message'); // just to emphasize this isn't a Backbone Model

mongoose.model('User',UserSchema);
var UserMongooseModel = mongoose.model('User');

mongoose.model('FoodTruck',FoodTruckSchema);
var FoodTruckMongooseModel = mongoose.model('FoodTruck');



// This function is responsible for returning all entries for the Message model
var getMessages = function(req, res, next) {
  // Resitify currently has a bug which doesn't allow you to set default headers
  // This headers comply with CORS and allow us to mongodbServer our response to any origin
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
  
  if( 'OPTIONS' == req.method ) {
    res.send( 203, 'OK' );
  }
  
  console.log("mongodbServer getMessages");

  MessageMongooseModel.find().limit(20).sort('date', -1).execFind(function (arr,data) {
    res.send(data);
  });
}

var postMessage = function(req, res, next) {
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
  
  if( 'OPTIONS' == req.method ) {
    res.send( 203, 'OK' );
  }
  
  // Create a new message model, fill it up and save it to Mongodb
  var message = new MessageMongooseModel(); 
  
  console.log("mongodbServer postMessage: " + req.params.message);

  message.message = req.params.message;
  message.date = new Date() 
  message.save(function () {
    res.send(req.body);
  });
}

var getUsers = function(req,res,next){
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
  
  if( 'OPTIONS' == req.method ) {
    res.send( 203, 'OK' );
  }
  
  console.log("mongodbServer getUsers");

  UserMongooseModel.find().limit(20).sort('name', -1).execFind(function (arr,data) {
    res.send(data);
  });
}

var postUser = function(req, res, next) {
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
  
  if( 'OPTIONS' == req.method ) {
    res.send( 203, 'OK' );
  }
  
  // Create a new message model, fill it up and save it to Mongodb
var user = new UserMongooseModel(); 
  
  console.log("mongodbServer postMessage: " + req.params.user);
  user.user = req.params.user;
  user.save(function () {
    res.send(req.body);
  });
}

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

    FoodTruckMongooseModel.find().execFind(function (arr,data) {
      var distances = {};
      for (var i = data.length - 1; i >= 0; i--) {
        var foodtruck = data[i];
        var distance = getDistanceFromLatLonInKm(lat,lng,foodtruck.latitude,foodtruck.longtitude);
        var id = data[i]._id;
        distances[id] = distance;
      }

      data.sort(function(a,b){
        var id1 = a._id;
        var id2 = b._id;
        var distance1 = distances[id1];
        var distance2 = distances[id2];
        console.log(distance1 + " compare to " + distance2);
        if(distance1 < distance2) return -1;
        if(distance1 > distance2) return 1;
        return 0;
     });
    res.send(data.slice(0,20));
  }); 
  } else {
    FoodTruckMongooseModel.find().limit(20).sort('truckName', -1).execFind(function (arr,data) {
      res.send(data);
    });
  }
}

var getFoodTrucksByLocation = function(req,res,next){
  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
  
  if( 'OPTIONS' == req.method ) {
    res.send( 203, 'OK' );
  }
  
  var lat = req.params.lat;
  var lng = req.params.lng;


  FoodTruckMongooseModel.find().execFind(function (arr,data) {
     var sortedData = [];
     for (var i = data.length - 1; i >= 0; i--) {
       var foodtruck = data[i];
       var distance = getDistanceFromLatLonInKm(lat,lng,foodtruck.latitude,foodtruck.longtitude);
       var entry = {};
       //Get the top 5 Sale items 
       data[i].distance = distance;
       foodtruck.distance = distance; 
       // console.log(foodtruck);
        entry.distance = distance;
        entry.foodtruck = foodtruck;
        sortedData.push(entry);
     };
     sortedData.sort(function(a,b){
        var distance1 = a.distance;
        var distance2 = b.distance;
        if(distance1 < distance2) return -1;
        if(distance1 > distance2) return 1;
        return 0;
     });
    res.send(sortedData.slice(0,20));
  }); 
}

mongodbServer.listen(mongodbPort, function() {
  
  var consoleMessage = '\n San Francisco Food Truck Application! Server Started';
  consoleMessage += '\n +++++++++++++++++++++++++++++++++++++++++++++++++++++' 
  consoleMessage += '\n\n %s says your mongodbServer is listening at %s';
  consoleMessage += '\n great! now open your browser to http://localhost:8080';
  consoleMessage += '\n it will connect to your httpServer to get your static files';
  consoleMessage += '\n and talk to your mongodbServer to get and post your messages. \n\n';
  consoleMessage += '+++++++++++++++++++++++++++++++++++++++++++++++++++++ \n\n'  
 
  console.log(consoleMessage, mongodbServer.name, mongodbServer.url);

});

mongodbServer.get('/messages', getMessages);
mongodbServer.post('/messages', postMessage);

mongodbServer.get('/users', getUsers);
mongodbServer.post('/users', postUser);


mongodbServer.get('/foodtrucks/:lat/:lng',getFoodTrucksByLocation);
mongodbServer.get('/foodtrucks',getFoodTrucks);
mongodbServer.get('/',onHtmlRequestHandler);
mongodbServer.get('/docs/.*',onHtmlRequestHandler);




