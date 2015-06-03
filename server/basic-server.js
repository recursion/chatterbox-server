/* Import node's http module: */
var http = require("http");
//var requestHandler = require("./request-handler").requestHandler;
var returnMessages = require("./request-handler").returnMessages;
var postBuilder = require("./request-handler").postBuilder;
var express = require('express');
var app = express();

app.use(express.static('client/client'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/client/index.html');
});

app.get('/classes/messages', function (req, res) {
  returnMessages(req, res);
});

app.post('/classes/messages', function (req, res) {
  postBuilder(req, res);
});

app.route(/\/classes\/.*$/g)
  .get(function(req, res) {
    var path = req.url;
    var roomname = path.split('/')[path.length - 1];
    returnMessages(req, res, roomname);
  })
  .post(function(req, res) {
    var path = req.url;
    var roomname = path.split('/')[path.length - 1];
    postBuilder(req, res, roomname);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Working on " + host + " and on " + port);
});
