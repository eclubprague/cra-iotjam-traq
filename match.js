var MongoClient = require('mongodb').MongoClient;
var distance = require('gps-distance');
var request = require('request');

console.log("Running");

MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {

	if(!err) {
		var carCollection = db.collection('car');
		var routesCollection = db.collection('routes');
		routesCollection.drop();
		var cars = carCollection.find();
		cars.forEach(function(car) {
			var matched = [];
			routesCollection.save({"devEUI":car.devEUI, "routes":matched});
			var index = 0;
			car.routes.forEach(function(route) {
				if(route.length > 5) {
					index++;
					var startTime = route[0].timestamp;
					var endTime = route[route.length-1].timestamp;
					
					var gpxData = getGPXFromRoute(route);
					matchPoints(db, gpxData, routeMatchedCallback, startTime, endTime, car.devEUI, index);

				}
			});
		});
	}else {
		console.log(err);
	}
});

function matchPoints(db, data, callback, startTime, endTime, devEUI, index) {
    var options = {
        uri: 'https://iot.eclubprague.com/graphhopper-api/match/?points_encoded=false',
        method: 'POST',
        accept: 'application/json',
        headers: {'Content-Type': 'application/gpx+xml'},
        body: data
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(db, body, startTime, endTime, devEUI, index);
        } else {
            console.log("Error: " + error);
        }
    });
}

function getGPXFromRoute(routeData) {
	var str = '';
        str += '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>';
        str += '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="Oregon 400t" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">';
        str += '<metadata>';
        str += '<link href="http://www.eclubprague.com">';
        str += '<text>eClubPrague</text>'
        str += '</link>'
        str += '<time>2016-10-17T22:58:43Z</time>'
        str += '</metadata>'
        str += '<trk>';
        str += '<name>Route</name>';
        str += '<trkseg>';
        for (var i = 0; i < routeData.length; i++) {
            str += '<trkpt lat="' + routeData[i].latitude + '" lon="' + routeData[i].longtitude + '">\n';
            str += '<time>' + routeData[i].timestamp.substr(0, routeData[i].timestamp.indexOf('+')) + 'Z</time>\n';
            str += '</trkpt>\n';
        }
        str += '</trkseg>';
        str += '</trk>';
        str += '</gpx>';
        return str;
}

function routeMatchedCallback(db, matchedData, startTime, endTime, devEUI, index) {
	var routeDistance = 0;
	var coords = JSON.parse(matchedData).paths[0].points.coordinates;
	for(var i = 1; i<coords.length; i++) {
		routeDistance += distance(coords[i-1][1], 
								  coords[i-1][0],
								  coords[i][1], 
								  coords[i][0]);
	}
	var routesCollection = db.collection('routes');
	var theRoute = {"index": index, "points": coords, "startTime":startTime, "endTime":endTime, "distance":routeDistance};
	routesCollection.updateOne({"devEUI": devEUI}, {$push: {"routes" : theRoute }}, function (err, result) {
                console.log("Route for car", devEUI, "updated into DB.", err);
	});

}

console.log("Done");