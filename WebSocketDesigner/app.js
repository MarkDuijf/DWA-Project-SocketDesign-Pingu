/**
 * Created by vince on 24-11-2015.
 */
var path        = require('path');
//var mongoose    = require('mongoose');
var express     = require('express');
var app         = express();
var server      = require('http').Server(app);
var io          = require('socket.io')(server);
var nodemailer  = require('nodemailer');
var bodyParser  = require('body-parser');
var session = require("express-session");

// Express
app.use(express.static(path.join(__dirname, 'clientside')));
app.use(bodyParser.json());
app.use(session({resave: true, saveUninitialized: true, secret: "sassas"}));

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'dwasdeu@gmail.com',
        pass: 'pingusdeu'
    }
});

app.post('/email',function(req,res){
    var mailOptions = {
        from: 'Socket Designer <dwasdeu@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Hello ' + req.body.firstName, // Subject line
        text: "Is it me you're looking for?", // plaintext body
        html: "<p>" + req.body.firstName + " " + req.body.lastName + "</p> <br> <p>" + req.body.username + ": " + req.body.password + " </p>" // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.status(500);
            res.send("Error!" + error);
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        res.status(200);
        res.send("Succes!");
    });
});

app.post('/login', function(req, res) {
    if(req.body.username === "us" && req.body.password === "ww") {
        console.log("Correct");
        req.session.loggedin = true;
        req.session.username = req.body.username;
        res.status(200);
        res.send("Succes!");
    } else {
        console.log("Faal!");
        req.session.loggedin = false;
        req.session.username = "";
        res.status(500);
        res.send("Wrong username/password");
    }
});

/*
var mailOptions = {
    from: 'Socket Designer <dwasdeu@gmail.com>', // sender address
    to: 'pluisam@gmail.com', // list of receivers
    subject: 'Hello', // Subject line
    text: "Is it me you're looking for?", // plaintext body
    html: "<b>Is it me you're looking for?</b>" // html body
};

 /*Code hieronder is voor het verzenden van de mail weg gecomment anders wordt Sam gespamt
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});
*/

//                     All socket.io code

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg) {
        console.log('Ik heb een message binnen gekregen: '+msg);
    })
});

server.listen(13000, function() {
    console.log('Server is running on port 13000')
});