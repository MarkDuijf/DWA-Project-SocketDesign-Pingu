//Hello Chat
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

app.use(express.static(path.join(__dirname)));
server.listen(3000);

io.on('connection', function(socket){

//emit to all
socket.on('broadcast/client', function(){
    io.emit('broadcast/server', {data: 'message for everyone!'});
});

//message to a specific room
socket.on('messageRoom/client', function(data){
    io.to('testroom1').emit('messageRoom/server', {data: 'something goes here'});
});

//message to a specific client
socket.on('messageClient/client', function(data){
    io.to('george').emit('messageClient/server', {data: 'hi george!'});
});

});