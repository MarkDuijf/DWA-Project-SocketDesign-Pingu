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

var mongoose = require('mongoose');
var dbName = "socketDesignerDB";
var User = require('./clientside/models/user');

//This inserts the testdata
var exec  = require('./clientside/models/testData/insertData');

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

mongoose.connect('mongodb://localhost/' + dbName, function(){
    app.post('/login', function(req, res) {
        User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
            console.log(user);
            if(err) {
                console.log(err);
                req.session.loggedin = false;
                req.session.username = "";
                res.status(500);
                res.send("Server error")
            } else if(user === null) {
                console.log("Incorrect!");
                req.session.loggedin = false;
                req.session.username = "";
                res.status(500);
                res.send("Wrong username/password");
            } else {
                console.log("Correct");
                req.session.loggedin = true;
                req.session.username = req.body.username;
                res.status(200);
                res.send("Succes!");
            } else if(user.activated === false) {
                req.session.loggedin = false;
                req.session.username = "";
                res.status(500);
                res.send("Not yet activated");
            } else {
                req.session.loggedin = false;
                req.session.username = "";
                res.status(500);
                res.send("Other reason");
            }
        });
    });

    app.post('/confirm', function(req, res) {
        User.findOne({email: req.body.email, confirmationLink: req.body.confirmation}, function(err, user) {
            if(user === null || user === undefined) {
                res.status(500);
                res.send("Confirmation failed, account doesn't exist");
            } else {
                if(user.activated === false) {
                    User.update({email: req.body.email, confirmationLink: req.body.confirmation}, { $set: { activated: true } }, function(err, result) {
                        if(err) {
                            console.log(err);
                            res.status(500);
                            res.send("Couldn't set activated to true");
                        } else {
                            console.log(result);
                            res.status(200);
                            res.send("The account has been activated")
                        }
                    });
                } else if(user.activated === true) {
                    res.status(500);
                    res.send("Account is already activated");
                }
            }
        });
    });

    app.post('/register', function(req, res) {
        console.log(req.body.email + " " + req.body.firstName + " " + req.body.lastName + " " + req.body.username + " " + req.body.password + " " + req.body.confirmationLink);

        var user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            confirmationLink: req.body.confirmationLink,
            activated: false
        });

        user.save(function(err) {
            if(err) {
                console.log(err);
                res.status(500);
                res.send("Error registering");
            } else {
                res.status(200);
                res.send("Account registered");

                //Email user
                var mailOptions = {
                    from: 'Socket Designer <dwasdeu@gmail.com>', // sender address
                    to: req.body.email, // list of receivers
                    subject: 'Hello ' + req.body.firstName, // Subject line
                    text: "Is it me you're looking for?", // plaintext body
                    html: "<a href='http://localhost:13000/#/home/" + req.body.email + "/" + req.body.confirmationLink + "'>Confirm your account</a>" // html body
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
            }
        });

        /*
        User.insert( { username: req.body.username, password: req.body.password, email: req.body.email, firstname: req.body.firstName, lastname: req.body.lastName, confirmationLink: req.body.confirmationLink, activated: false }, function(err, result) {
            if(err) {
                console.log(err);
                res.status(500);
                res.send("Error registering");
            }
            console.log(result);
            res.status(200);
            res.send("Account registered");

            //Email user
            var mailOptions = {
                from: 'Socket Designer <dwasdeu@gmail.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'Hello ' + req.body.firstName, // Subject line
                text: "Is it me you're looking for?", // plaintext body
                html: "<a href='http://localhost:13000/#/home/" + req.body.email + "/" + req.body.confirmationLink + "'>Confirm your account</a>" // html body
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
        });
        */
    });
});

// All socket.io code

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