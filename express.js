var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/:id/routes', function (req, res) {
    MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
        if (!err) {
            console.log(req.params.id);
            var filter = {"devEUI": req.params.id};


            var car = db.collection("car").find(filter);
            car.forEach(function (car) {
                var response = [];

                car.routes.forEach(function (route) {
                    if (route.length > 0) {
                        var newRoute = [];

                        route.forEach(function (routePoint) {
                            var point = {};
                            point.lat = routePoint.latitude;
                            point.lng = routePoint.longtitude;
                            point.time = routePoint.timestamp;
                            newRoute.push(point);
                        });
                        response.push(newRoute);
                    }
                });
                res.send(response);
            });
        }
    });
});

app.get('/:id/matches', function (req, res) {
    MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
        if (!err) {
            console.log(req.params.id);
            var filter = {"devEUI": req.params.id};


            var routes = db.collection("routes").find(filter);
            routes.forEach(function (matched) {
                var response = [];

                matched.routes.forEach(function (route) {
                        response.push(route);
                });
                res.send(response);
            });
        }
    });
});

app.get('/:id/matches/:index', function (req, res) {
        MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
        if (!err) {
            console.log(req.params.id);
            var filter = {"devEUI": req.params.id};
            var index = req.params.index;
            var routes = db.collection("routes").find(filter);
            routes.forEach(function (matched) {
                var response = [];
                if(index >= 0 && index <matched.routes.length) {
                    var route = matched.routes[index];
                    response.push(route);
                }
                res.send(response);
            });

        }
    });
});

app.get('/:id/routes/:index', function (req, res) {
    MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
        if (!err) {
            console.log(req.params.id);
            var filter = {"devEUI": req.params.id};
            var index = req.params.index;


            var car = db.collection("car").find(filter);
            car.forEach(function (car) {
                var response = [];

                if(index >= 0 && index <car.routes.length) {
                    var route = car.routes[index];
                    if (route.length > 0) {
                        var newRoute = [];

                        route.forEach(function (routePoint) {
                            var point = {};
                            point.lat = routePoint.latitude;
                            point.lng = routePoint.longtitude;
                            point.time = routePoint.timestamp;
                            newRoute.push(point);
                        });
                        response.push(newRoute);
                    }
                }
                res.send(response);
            });

        }
    });

});

app.get('/cars', function (req, res) {
    MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
        if (!err) {
            db.collection("car").find({}, {_id: 0, routes: 0, locationRecords: 0}).toArray(function (err, cars) {
                res.send(cars);
            });
        }
    });

});


app.listen(3000);