var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");
var request = require('request');
var moment = require('moment');
var path = require("path")
var fs = require('fs');
var PythonShell = require('python-shell');


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));


app.use(express.static('public'));

/* 
the workflow
1. application starts ==> (X)
2. the client application starts==> (X)
3. Dropdown: 
  + {stops of interest} (X)
  + {time walking to stop} (X)
4. The user selects ==>
  + {stop of interest} (X)
  + {destination} (X)
  + {time walking to stop} {X}
5. User submits data ==> post request {X}
9. The server receives the {PT option and direction of interest} + {time walking to the stop} ==>
10. The server then:
  + stores the {current time} (X)
  + retrieves the {arrival times} for the {selected PT option & direction} ==> stores them to an array (X)
  + sort the data based on arrival time //TODO
  + For i in the array:
      If ( the {current time} + {time walking to the stop} is < than the arrival time){
        // get the arrival time for the {selected PT option & direction}
        // trigger LED lights
      } else{
        // remove i and 
        // get the arrival time for the NEXT {selected PT option & direction}
        // trigger the LED lights
      } 
  + begin the setInterval countdown every X seconds until  
    the {current time} + {time walking to the stop} is <= than the arrival time:
      - 
  + 
    

*/



/**
Data Model
+ Locally store the previous data request
+ Locally store the latest data request
+ basically an array and push and pop
*/

var appData = {
    currentTime: null,
    nextArrivalTime: null,
    countDown: null,
    selectedData: null,
    startLocation: null,
    direction: null,
    walkingDelay: 10,
    continueCollectTransitData: null,
};


/**
@Function
Set interval to keep updating the current time
*/
setInterval(function() {
    appData.currentTime = getTime();
    console.log("current time:", appData.currentTime);
}, 1000);

setInterval(function() {
    if (appData.nextArrivalTime != null) {
        console.log("nextArrivalTime:", appData.nextArrivalTime);
    }
}, 1000)


setInterval(function() {
    if (appData.nextArrivalTime != null) {
        appData.countDown = getTimeToArrival(moment(appData.currentTime), moment(appData.nextArrivalTime))
        console.log("countDown:", appData.countDown);
    } else {
        console.log("no arrival scheduled yet!")
    }
}, 1000)


/**
@Function
get the current time
*/
function getTime() {
    var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    var stillUtc = moment.utc(date).toDate();
    var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
    return local;
}

/**
@Function
Parse the time 
*/
function parseTime(tString) {
    // "2017-05-17T22:06:45+02:00" // from transit data
    // 2017-05-17 21:59:18 // from moment
    var outputTime;
    if (tString.indexOf('T') > -1) {
        outputTime = tString.replace('T', ' ').substring(0, tString.length - 6);
    } else {
        outputTime = tString;
    }
    return moment(outputTime).format('YYYY-MM-DD HH:mm:ss');
}

/**
@Function
Get time to arrival by 
subtracting 2 moment times
*/
function getTimeToArrival(date1, date2) {
    // return how manny minutes between
    var output = {min: null, sec: null};
    var t = moment.duration(date2.diff(date1)).asSeconds(); // diff yields milliseconds
    
    output.min = Math.floor(t/60);
    output.sec = t%60;
    console.log(output);
    return output;
}

/**
@Function 
test for getting transit data from VAG
https://start.vag.de/dm-beta/api/v1/abfahrten/VAG/RA?timedelay=10
*/
app.post("/test", function(req, res) {

    var url = "https://start.vag.de/dm-beta/api/v1/abfahrten/VAG/RA?timedelay=10";

    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const fbResponse = JSON.parse(body)
            console.log("Got a response: ", fbResponse);
            res.send(fbResponse);
        } else {
            console.log("Got an error: ", error, ", status code: ", response.statusCode)
        }
    })

})

/**
@Function 
test for getting transit data from VAG
https://start.vag.de/dm-beta/api/v1/abfahrten/VAG/RA?timedelay=10
*/
app.get("/test", function(req, res) {

    var url = "https://start.vag.de/dm-beta/api/v1/abfahrten/VAG/RA?timedelay=10";

    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const fbResponse = JSON.parse(body)
            console.log("Got a response: ", fbResponse);
            res.send(fbResponse);
        } else {
            console.log("Got an error: ", error, ", status code: ", response.statusCode)
        }
    })

})


/**
@Function 
for getting transit data from VAG
https://start.vag.de/dm-beta/api/v1/abfahrten/VAG/RA?timedelay=10
+ accepts the start, direction, and delay
*/
app.post("/retrieve", function(req, res) {
    console.log(req.body);


    var a = "RA" || req.body.start;
    var b = "Flughafen" || req.body.direction;
    var d = 5 || req.body.walkTime;

    appData.startLocation = a;
    appData.direction = b;
    appData.walkingDelay = d;
    console.log(a, b, d);
    var url = `https://start.vag.de/dm-beta/api/v1/abfahrten/VAG/${a}?timespan=180&timedelay=${d}&limitcount=50`;
    request(url, (error, response, body) => {

        if (!error && response.statusCode === 200) {

            var fbResponse = JSON.parse(body);
            // console.log(fbResponse.Abfahrten.length)

            // get back only the lines you're interested in
            fbResponse.Abfahrten = fbResponse.Abfahrten.filter(function(dest) {
                // update what the time IS:
                dest.AbfahrtszeitIst = parseTime(dest.AbfahrtszeitIst);
                return dest.Richtungstext === b;
            })

            // store the data locally on server
            // console.log(fbResponse.Abfahrten.length)
            appData.selectedData = fbResponse;
            // console.log("selected data:", appData.selectedData)
            console.log(appData.selectedData);
            if(appData.selectedData.Abfahrten[0]){
              appData.nextArrivalTime = fbResponse.Abfahrten[0].AbfahrtszeitIst;
            } 
            else if(appData.countDown <= appData.walkingDelay || fbResponse.Abfahrten[1]){
              appData.nextArrivalTime = fbResponse.Abfahrten[1].AbfahrtszeitIst;
            }
            else if(appData.countDown <= appData.walkingDelay || fbResponse.Abfahrten[2]){
              appData.nextArrivalTime = fbResponse.Abfahrten[2].AbfahrtszeitIst;
            } 
            else{
              appData.nextArrivalTime = appData.currentTime;
              console.log("arrival time is less than your walk time")
            }
            console.log("next arrival:", appData.nextArrivalTime)

            // send the data to the client
            var toClient = {selected: appData.selectedData, serverData: appData}
            res.send(toClient);

        } else {
            console.log("Got an error: ", error, ", status code: ", response.statusCode)
        }
    })

})


/**
@Function 
+ Keep an eye on the time counter ==> setInterval
+ call the functions for the lights
*/
setInterval(function(){
  // do stuff
  // var process = spawn('python',["path/to/script.py", arg1, arg2, ...]);
  if(appData.countDown){
    if(appData.countDown.min < 5){
      // console.log("lt 5")
      lightUp(5)
    } 
    else if(appData.countDown.min < 10){
      // console.log("lt 10")
      lightUp(10)
    }
    else if(appData.countDown.min < 15){
      // console.log("lt 15")
      lightUp(15)
    }
    else if(appData.countDown.min < 20){
      // console.log("lt 20")
      lightUp(20)
    } else{
      console.log("something else")
    }
  }
  
}, 1000);

function lightUp(phase){
  var lightStyle = "light"+phase+".py"
  var pypath = "./scripts/" + lightStyle;
  console.log(pypath);

  PythonShell.run(pypath, function (err) {
    if (err) throw err;
    console.log('finished');
  });

}




// set the app to listen at 3000
app.listen(3000, function() {
    console.log('listening on 3000')
})