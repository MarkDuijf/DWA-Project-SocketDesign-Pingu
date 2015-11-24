/**
 * Created by vince on 24-11-2015.
 */
var path        = require('path');
//var mongoose    = require('mongoose');
var express     = require('express');
var app         = express();
var server      = require('http').Server(app);
//var io          = require('socket.io')(server);

// Express
app.use(express.static(path.join(__dirname, 'clientside')));

server.listen(3000, function() {
    console.log('Server is running on port 3000')
});