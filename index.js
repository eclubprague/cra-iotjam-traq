var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//api.pripoj.me/device/get/GPSinCars?token=jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj
//api.pripoj.me/message/get/0018B20000000165?token=jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj&limit=1000&offset=20000


function getCars(callback) {
	var options = {
	    uri: 'https://api.pripoj.me/device/get/GPSinCars?token=jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj',
	    method: 'GET',
	    json:true
	}
	request(options, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		var cars = body;
    		callback(body);
  		}else {
  			console.log("Error: "+error);
  		}
	});
}

function getCarDataRequest(db, callback, devEUI, offset) {
	var options = {
	    uri: 'https://api.pripoj.me/message/get/'+devEUI+'?token=jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj&limit=1000&offset='+offset,
	    method: 'GET',
	    json:true
	}
	request(options, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
    		var cars = body;
    		callback(db, body, devEUI, offset);
  		}else {
  			console.log("Error: "+error);
  		}
	});
}


function getCarData(db, data, devEUI, offset) {
	var count = data._meta.count;
	if(count == 1000) {
		for(var i = 0; i<count; i++) {
			insertCardataIntoDB(db, data.records[i])
		}
		getCarDataRequest(db, getCarData, devEUI, offset+1000);
		console.log("Next request: "+devEUI+" offset: "+offset);
	}else {
		for(var i = 0; i<count; i++) {
			insertCardataIntoDB(db, data.records[i])
		}
		console.log(devEUI+" ends on: "+(offset+count));
	}
}

function insertCardataIntoDB(db, cardata) {
	db.collection('cardata').insertOne(cardata, function(err, result) {
		
	});
}

function insertCarIntoDB(db, car) {
	db.collection('car').insertOne(car, function(err, result) {
		console.log("Inserted into DB:")
	});
}



// Connect to the db
MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function(err, db) {
  if(!err) {
    //Get cars
	getCars(function(cars) {
		var count = cars._meta.count;
		var records = cars.records;
		for(var i = 0; i < count; i++) {
			var devEUI = records[i].devEUI;
			getCarDataRequest(db, getCarData, devEUI, 0);
			//insertCarIntoDB(db, records[i]);
		}
	});
  }
});


