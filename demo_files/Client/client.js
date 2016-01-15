//message to send to everyone
socket.emit('broadcast/client');

//emit to all
socket.on('broadcast/server', function(data){
    //placeholder text
});

//message to a specific room
socket.emit('messageRoom/client', {data: 'something goes here'});

//message to a specific room
socket.on('messageRoom/server', function(data){
    //placeholder text
});

//message to specific client
socket.emit('messageClient/client', {data: 'hi george!'});

//message to a specific client
socket.on('messageClient/server', function(data){
    //placeholder text
});

