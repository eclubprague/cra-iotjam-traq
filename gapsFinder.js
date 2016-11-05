var MongoClient = require('mongodb').MongoClient;
var distance = require('gps-distance');

var maxDelay = 1200000; //120 seconds

console.log("running");

MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
    var last = 0;
    var count = 0;

    if (!err) {
        var carData = db.collection('car');


        var cars = carData.find();

        var finished = 0;
        var toFinish = 8;

        console.log(finished, toFinish);


        cars.forEach(function (car) {

            var route = [];
            var gaps = 0;

            var previousLat = undefined;
            var previousLon = undefined;

            car.locationRecords.forEach(function (locationRecord) {
                count++;
                if (Math.abs(locationRecord.timestamp - last) < maxDelay) {
                    //if next record fits in given interval
                    var routePoint = {}
                    routePoint.latitude = locationRecord.lrrLAT;
                    routePoint.longtitude = locationRecord.lrrLON;
                    routePoint.timestamp = locationRecord.timestamp;
                    if ((previousLat != undefined) && (previousLat != undefined)) {
                        routePoint.distance = distance(previousLat, previousLon, routePoint.latitude, routePoint.longtitude)*1000.0;
                        previousLat = routePoint.latitude;
                        previousLon = routePoint.longtitude;
                    } else {
                        routePoint.distance = 0;
                    }
                    route.push(routePoint);

                } else {
                    //if there is a gap
                    car.routes.push(route);
                    previousLat = undefined;
                    previousLon = undefined;
                    route = [];
                    //console.log("found gap", locationRecord.lrrLAT, locationRecord.lrrLON, count);
                    count = 0;
                    gaps++;
                }
                last = locationRecord.timestamp;
            });

            carData.updateOne({devEUI: car.devEUI}, {$set: {"routes": car.routes}}, function (err, result) {
                console.log("Car", car.devEUI, "updated into DB.", err);
                finished++;
                console.log("finished", finished, toFinish);
                if (finished === toFinish) {
                    db.close();
                    process.exit();
                }
            });
            console.log(car.devEUI, "route has", gaps, "gaps");


        });

    } else {
        console.log(err);
    }
});

console.log("done");

