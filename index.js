var ecstatic = require('ecstatic');
var http = require('http');

var port = process.env.PORT || 4040;
http.createServer(ecstatic({root: __dirname})).listen(port);
console.log("Listening on port "+port);
