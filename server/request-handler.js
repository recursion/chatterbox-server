var uuid = require('node-uuid');

var messages = [];

var returnMessages = function(request, response, roomname) {
  var results = {};
  var returnMessages;
  if (roomname) {
    returnMessages = getMessagesByRoom(roomname);
  } else {
    returnMessages = messages;
  }
  constructHeader(response);
  results.results = returnMessages;
  response.end(JSON.stringify(results));
};

var getMessagesByRoom = function(roomname) {
  var roomMessages = [];
  for (var i =0; i < messages.length; i++){
    if (messages[i].roomname === roomname){
      roomMessages.push(messages[i]);
    }
  }
  return roomMessages;
};

// Gather POST data and pass it to messageBuilder
var postBuilder = function(request, response, roomname) {
  roomname = roomname || '';
  constructHeader(response, 201);
  var body = '';
  request.on('data', function(chunk){
    body += chunk.toString();
  });
  request.on('end', function() {
    var postObj = JSON.parse(body);
    postObj.roomname = roomname;
    messageBuilder(postObj);
  });
  response.end();
};

//takes passed in object parameters and builds an object with
//additional metadata to be passed to the global messages array
var messageBuilder = function (dataObj) {
  var messageObject = {
    message : dataObj.message,
    username : dataObj.username,
    roomname : dataObj.roomname,
    createdAt : Date.now(),
    uniqueId : uuid.v1(),
    updatedAt : Date.now()
  };
  messages.push(messageObject);
};

// creates header data, status code and content type for each request
var constructHeader = function (response, status) {
  status = status || 200;
  var statusCode = status;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/JSON";
  response.writeHead(statusCode, headers);
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

/// EXPORTS
exports.returnMessages = returnMessages;
exports.postBuilder = postBuilder;
//exports.requestHandler = requestHandler;
// var requestHandler = function(request, response) {

  //console.log("Serving request type " + request.method + " for url " + request.url);

  // regex for matching roomnames
//   var re = /\/classes\/.*$/g;

//   // respond to OPTIONS requests
//   if (request.method === 'OPTIONS'){
//     constructHeader(response);
//     response.end();
//   }

//   // Routes Processing
//   if (request.url === '/classes/messages' ){
//     if (request.method === 'GET'){
//       constructHeader(response);
//       var results = {};
//       results.results = messages;
//       response.end(JSON.stringify(results));

//     } else if (request.method === 'POST'){
//       postBuilder(request, response);
//     }
//   } else if (re.test(request.url)) {
//     var path = request.url;
//     var roomname = path.split('/')[path.length - 1];

//     if (request.method === 'GET') {
//       constructHeader(response);

//       // gather all messages with this roomname
//       // and send tyhem back to the client
//       var results = {};
//       var roomMessages = [];
//       for (var i =0; i < messages.length; i++){
//         if (messages[i].roomname === roomname){
//           roomMessages.push(messages[i]);
//         }
//       }
//       results.results = roomMessages;
//       response.end(JSON.stringify(results));

//     } else if (request.method === 'POST') {
//       postBuilder(request, response);
//     }
//   } // if url does not match any of the above, return an 404 error header message
//   else {
//     constructHeader(response, 404);
//     response.end();
//   }
// };


