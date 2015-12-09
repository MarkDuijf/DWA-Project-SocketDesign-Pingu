var path = require('path');
var express = require('express');
var app = express();
module.exports = app;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var session = require("express-session");

//This inserts the testdata
require('./models/dummyData/insertData');

// Express
app.use(express.static(path.join(__dirname, 'clientside')));
app.use(bodyParser.json());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "sassas"
}));

//Alle code die iets te maken hebben met het versturen van een email, zoals het contactformulier
require('./routes/emailRoutes')(app);

//Alle code van routes die mongo nodig hebben om te werken, zoals inloggen, registreren en confirmeren
require('./routes/mongoRoutes')(app);

//All socket.io code
io.on('connection', function (socket) {
    "use strict";
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        console.log('Ik heb een message binnen gekregen: ' + msg);
    });
});

server.listen(13000, function () {
    "use strict";
    console.log('Server is running on port 13000');
});