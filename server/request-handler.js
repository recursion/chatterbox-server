/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var uuid = require('node-uuid');

var messages = [];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  //console.log("Serving request type " + request.method + " for url " + request.url);

  // regex for matching roomnames
  var re = /\/classes\/.*$/g;

  // respond to OPTIONS requests
  if (request.method === 'OPTIONS'){
    constructHeader(response);
    response.end();
  }

  // Routes Processing
  if (request.url === '/classes/messages' ){
    if (request.method === 'GET'){
      constructHeader(response);
      var results = {};
      results.results = messages;
      response.end(JSON.stringify(results));

    } else if (request.method === 'POST'){
      postBuilder(request, response);
    }
  } else if (re.test(request.url)) {
    var path = request.url;
    var roomname = path.split('/')[path.length - 1];

    if (request.method === 'GET') {
      constructHeader(response);

      // gather all messages with this roomname
      // and send tyhem back to the client
      var results = {};
      var roomMessages = [];
      for (var i =0; i < messages.length; i++){
        if (messages[i].roomname === roomname){
          roomMessages.push(messages[i]);
        }
      }
      results.results = roomMessages;
      response.end(JSON.stringify(results));

    } else if (request.method === 'POST') {
      postBuilder(request, response);
    }
  } // if url does not match any of the above, return an 404 error header message
  else {
    constructHeader(response, 404);
    response.end();
  }
};
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  //response.end("Hello, World!");

// Gather POST data and pass it to messageBuilder
var postBuilder = function(request, response) {
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
  // The outgoing status.
  status = status || 200;
  var statusCode = status;
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "application/JSON";
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);
};
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
