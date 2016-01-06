var express = require('express'),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server),
    path = require('path');

app.use(express.static(path.join(__dirname, 'clientside')));

server.listen(3000);

io.sockets.on("connection", function (socket) {

    // Sends a message every 1000 milliseconds
    setInterval(function () {

        var d = new Date();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();

        if (seconds < 10)
        {
            seconds = "0" + seconds;
        }
        if (minutes < 10)
        {
            minutes = "0" + minutes;
        }
        if (hours < 10)
        {
            hours = "0" + hours;
        }

        var time = hours + ":" + minutes + ":" + seconds;

        io.sockets.emit('heartbeat', {hello: 'world!', time: time});
    }, 1000);

    // Sends a message to the chat board
    socket.on("sendMessage", function (data) {

        var d = new Date();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();

        if (seconds < 10)
        {
            seconds = "0" + seconds;
        }
        if (minutes < 10)
        {
            minutes = "0" + minutes;
        }
        if (hours < 10)
        {
            hours = "0" + hours;
        }

        var time = hours + ":" + minutes + ":" + seconds;

        io.sockets.emit("newMessage", data, time);
    });

});