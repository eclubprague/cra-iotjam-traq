var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var convertHex = require('convert-hex');

//api.pripoj.me/device/get/GPSinCars?token=jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj
//api.pripoj.me/message/get/0018B20000000165?token=jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj&limit=1000&offset=20000

var token = "jhYUm4QuKXXK3LdqxpBeKiaHV4JR97Zj";
var constOffset = 1000;
var toFinish = 0;
var finished = 0;

function convert(data) {

    var msg = {};
    msg.payload=convertHex.hexToBytes(data);

    var ret = {};
    status = msg.payload[0];
    temp_is_present = status & 0x80;
    acc_is_present = status & 0x40;
    btn1_is_present = status & 0x20;
    gps_is_present = status & 0x10;

    up_is_present = status & 0x08;
    down_is_present = status & 0x04;
    batt_is_present = status & 0x02;
    rssi_is_present = status & 0x01;

    ret.temp = msg.payload[1];
    ret.btn1 = btn1_is_present;

    // work on gps data
    if (gps_is_present) {
        shift = 8
        ret.gps=true
        ret.lat = ((msg.payload[2] & 0xF0 ) >> 4)*10 + (msg.payload[2] & 0x0F)
        ret.lat += ((((msg.payload[3] & 0xF0 ) >> 4)*10 + (msg.payload[3] & 0x0F) +
            (((msg.payload[4] & 0xF0) >> 4) / 10) +
            ((msg.payload[4] & 0x0F) / 100 ) +
            ((msg.payload[5] & 0xF0) >> 4) /1000)) /60

        ret.lon = ((msg.payload[6] & 0xF0 ) >> 4)*100 + (msg.payload[6] & 0x0F )*10 + ((msg.payload[7] & 0xF0) >> 4) // degree
        ret.lon += (((msg.payload[7] & 0x0F )* 10 + ((msg.payload[8] & 0xF0) >> 4) +
            ((msg.payload[8] & 0x0F) / 10) + ((msg.payload[9] & 0xF0) >> 4) / 100)) /60

        ret.lat = ret.lat.toFixed(6)
        ret.lon = ret.lon.toFixed(6)
    } else {
        shift = 0
        ret.gps=false
    }

    ret.uplink = msg.payload[2+shift];
    ret.down = msg.payload[3+shift];
    ret.vbat = ((msg.payload[4+shift] << 8) + msg.payload[5+shift]) / 1000;

    if (rssi_is_present) {
        ret.rssi = msg.payload[6+shift] * -1
        ret.snr =  msg.payload[7+shift]
    }

    msg.raw = msg.payload;
    msg.payload = ret;

    return msg;
}

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
        //console.log("Next request: " + car.devEUI + " offset: " + offset);
        getCarDataRequest(db, getCarData, car, offset + constOffset);
    } else {
        console.log(car.devEUI, " ends on: " + (offset + data.records.length), "//", car.locationRecords.length);
        //console.log(car.devEUI, " finding routes");
        findRoutes(car);
        insertCarIntoDB(db, car);
    }
}

function clearDB(db){
    db.collection('car').drop();
}

function insertCarIntoDB(db, car) {
    db.collection('car').insertOne(car, function (err, result) {
        console.log("Car", car.devEUI, "inserted into DB.",err);
        finished++;
        console.log("finished",finished,toFinish);
        if(finished===toFinish){
            db.close();
            process.exit();
        }
    });
}

function findRoutes(car) {
    //route search is in gapsFindes.js here we just add timestamp

    var newLocationRecords = [];

    car.locationRecords.forEach(function(record){
        // values to trim

        if(record.payloadHex.length>0) {

            var decodedPayload = convert(record.payloadHex);

            if (decodedPayload.payload.gps) {

                var newRecord = {};
                newRecord.timestamp = new Date(record.createdAt).getTime();
                newRecord.createdAt = record.createdAt;
                newRecord.lrrLAT = decodedPayload.payload.lat;
                newRecord.lrrLON = decodedPayload.payload.lon;
                newLocationRecords.push(newRecord);
            }
        }
    });

    car.locationRecords=newLocationRecords;

    car.locationRecords.reverse();

    car.routes = [];
}


MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
    if (!err) {

        clearDB(db);
        getCars(function (cars) {
            toFinish=cars.records.length;
            cars.records.forEach(function (car) {
                car.locationRecords = [];
                getCarDataRequest(db, getCarData, car, 0);
            });
        });
    }
});


