var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");


var socket = require('socket.io');
var server = app.listen(3000);
var io = socket(server);

app.use(express.static('public'));
io.sockets.on('connection', newConnection);



app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.get("/", function(req, res) {
  res.send("hello World");
})


app.get("/:home", function(req, res) {
  res.send(req.params.home);
})


function newConnection(socket){
  console.log('new connection: ' + socket.id);

  console.log("number of sockets:", socketCount);
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


/*

setInterval() --> every 30 seconds & interpolate ==> then update the model

Websockets 

*/