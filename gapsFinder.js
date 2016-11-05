var MongoClient = require('mongodb').MongoClient;

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


            car.locationRecords.forEach(function (locationRecord) {
                count++;
                if (Math.abs(locationRecord.timestamp - last) < maxDelay) {
                    //if next record fits in given interval
                    var routePoint = {}
                    routePoint.lat = locationRecord.lrrLAT;
                    routePoint.long = locationRecord.lrrLON;
                    routePoint.timestmap = locationRecord.timestamp;
                    route.push(routePoint);

                } else {
                    //if there is a gap
                    car.routes.push(route);
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
                console.log("finished", finished,toFinish);
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

