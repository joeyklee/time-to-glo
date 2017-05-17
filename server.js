var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");
var request = require('request');


var socket = require('socket.io');
var server = app.listen(3000);
var io = socket(server);

app.use(express.static('public'));
io.sockets.on('connection', newConnection);



app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

// app.get("/", function(req, res) {
//   res.send("hello World");
// })


// app.get("/:home", function(req, res) {
//   res.send(req.params.home);
// })



/**
Data Model
+ Locally store the previous data request
+ Locally store the latest data request
+ basically an array and push and pop
*/


/**
Function 
for getting transit data from VAG
https://start.vag.de/dm-beta/api/v1/abfahrten/VAG/RA?timedelay=10
*/

app.get("/test", function(req, res) {
  var url = "https://start.vag.de/dm-beta/api/v1/abfahrten/VAG/RA?timedelay=10";

  request(url, (error, response, body)=> {
    if (!error && response.statusCode === 200) {
      const fbResponse = JSON.parse(body)
      console.log("Got a response: ", fbResponse)
      res.send(fbResponse);
    } else {
      console.log("Got an error: ", error, ", status code: ", response.statusCode)
    }
  })
})




/**
Function
+ setInterval() every 30 seconds to update the data
*/



/**
Function 
Nürnberg/Hauptbahnhof
Nürnberg/Maffeiplatz

*/


/* 
+ Home location
+ current time
+ location of the stop & stopID or Stopname  ==> and all the incoming trips
*/





function newConnection(socket){
  console.log('new connection: ' + socket.id);

  socket.on('mouse', mouseMsg);
  socket.on('disconnect', disconnectMsg);

  function mouseMsg(data){
    socket.broadcast.emit('mouse', data);
    // io.sockets.emit('mouse', data);
  }

  function disconnectMsg(){
    console.log("disconnected! " + socket.id);
  }
}



// // set the app to listen at 3000
// app.listen(3000, function() {
//  console.log('listening on 3000')
// })
