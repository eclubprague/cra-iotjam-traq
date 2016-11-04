var MongoClient = require('mongodb').MongoClient;

var maxDelay =

console.log("running");

MongoClient.connect("mongodb://iot.eclubprague.com:27017/traq", function (err, db) {
    var last = 0;
    var count = 0;

    if (!err) {
        var carData = db.collection('cardata');
        carData.find({devEUI:"0018B20000000335"}).forEach(function (myDoc) {
            count++;
            //console.log("user: ", myDoc);

            var d = new Date(myDoc.createdAt);

            if(Math.abs(d.getTime()-last)>10000000){

                console.log("hovno",d.getTime(),myDoc.lrrLAT,myDoc.lrrLON,last,count);
                count=0;
                last=d.getTime();
            }


        });

    } else {
        console.log(err);
    }
});

console.log("done");

