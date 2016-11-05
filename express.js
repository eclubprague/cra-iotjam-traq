var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var app = express();

app.get('/:id', function (req, res) {
    MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
        if (!err) {
            console.log(req.params.id);
            var filter = {"devEUI":req.params.id};


            var car = db.collection("car").find(filter);
            car.forEach(function(car){
                var response = [];

                car.routes.forEach(function(route){
                    if(route.length>0){
                        var newRoute = [];

                        route.forEach(function(routePoint){
                            var point = {};
                            point.lat=routePoint.latitude;
                            point.lng=routePoint.longtitude;
                            newRoute.push(point);
                        });
                        response.push(newRoute);
                    }
                });


                res.send(response);
            });

        }
    });

})

app.listen(3000);