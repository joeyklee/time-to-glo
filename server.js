var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");


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




// // set the app to listen at 3000
app.listen(3000, function() {
	console.log('listening on 3000')
})


/*

setInterval() --> every 30 seconds & interpolate ==> then update the model

Websockets 

*/