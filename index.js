var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//api.pripoj.me/device/get/GPSinCars?token=jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj
//api.pripoj.me/message/get/0018B20000000165?token=jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj&limit=1000&offset=20000

var token = "jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj";
var constOffset = 1000;


function getCars(callback) {
    var options = {
        uri: 'https://api.pripoj.me/device/get/GPSinCars?token=' + token,
        method: 'GET',
        json: true
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(body);
        } else {
            console.log("Error: " + error);
        }
    });
}

function getCarDataRequest(db, callback, car, offset) {
    var options = {
        uri: 'https://api.pripoj.me/message/get/' + car.devEUI + '?token=' + token + '&limit=' + constOffset + '&offset=' + offset,
        method: 'GET',
        json: true
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(db, body, car, offset);
        } else {
            console.log("Error: " + error);
        }
    });
}

function getCarData(db, data, car, offset) {
    car.locationRecords = car.locationRecords.concat(data.records);
    if (data.records.length == constOffset) {
        console.log("Next request: " + car.devEUI + " offset: " + offset);
        getCarDataRequest(db, getCarData, car, offset + constOffset);
    } else {
        console.log(car.devEUI, " ends on: " + (offset + data.records.length), "//", car.locationRecords.length);
        console.log(car.devEUI, " finding routes");
        findRoutes(car);
        insertCarIntoDB(db, car);
    }
}

function clearDB(db){
    db.collection('car').drop();
}

function insertCarIntoDB(db, car) {
    db.collection('car').insertOne(car, function (err, result) {
        console.log("Car", car.devEUI, "inserted into DB.");
    });
}

function findRoutes(car) {
    car.locationRecords.forEach(function(record){
        record.timestamp = new Date(record.createdAt).getTime();


    });

    car.routes = [];
}


MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
    if (!err) {

        clearDB(db);
        getCars(function (cars) {
            cars.records.forEach(function (car) {
                car.locationRecords = [];
                getCarDataRequest(db, getCarData, car, 0);
            });
        });
    }
});


