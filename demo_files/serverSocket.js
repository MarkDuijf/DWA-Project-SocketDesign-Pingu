var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);

server.listen(3000);
app.get("/", function (req, res) {
    res.sendfile("./index.html");
});

io.sockets.on("connection", function (socket) {

    // Sends a message every 1000 milliseconds
    setInterval(function () {
        var d = new Date();
        io.sockets.emit('heartbeat', {hello: 'world!', date: d});
    }, 1000);

    // Sends a message to the chat board
    socket.on("sendMessage", function (data) {
        io.sockets.emit("newMessage", data);
    });

});
