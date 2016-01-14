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

//All the routes that require email, like the contact form
require('./routes/emailRoutes')(app);

//All the routes that require mongo to work correctly, like logging in, registering and confirming
require('./routes/mongoRoutes')(app);

//All the routes related to downloading, like the downloading of a project
require('./routes/downloadRoutes')(app);

var User = require('./models/user');
var Project = require('./models/project');

server.listen(13000, function () {
    "use strict";
    console.log('Server is running on port 13000');
});