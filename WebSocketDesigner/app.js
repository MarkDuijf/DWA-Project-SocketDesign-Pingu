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

//Alle code voor het downloaden van een zip bestand met een project
require('./routes/downloadRoutes')(app);

var User = require('./models/user');
var Project = require('./models/project');

app.get('/myAccount', function(req, res) {
    if(req.session.loggedin !== true) {
        res.status(400);
        res.send("Not logged in");
    } else if(req.session.loggedin === true) {
        //TODO misschien wachtwoord in de session zetten?
        User.findOne({username: req.session.username}, function(err, user) {
            if(err) {
                console.log(err);
                res.status(500);
                res.send("Error finding user");
            } else {
                var data = {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    projects: null
                };

                Project.find({username: req.session.username}, function(err, projects){
                    if(err) {
                        console.log(err);
                        res.status(500);
                        res.send("Error finding projects");
                    } else {
                        data.projects = projects;
                        res.status(200);
                        res.send(data);
                    }
                });
            }
        });
    }
});

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