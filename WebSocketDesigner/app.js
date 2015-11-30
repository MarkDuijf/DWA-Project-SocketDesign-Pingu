var path        = require('path');
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
var Project = require('./clientside/models/project');

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
                res.status(401);
                res.send("Wrong username/password");
            } else if (user.activated === true) {
                console.log("Correct");
                req.session.loggedin = true;
                req.session.username = req.body.username;
                res.status(200);
                res.send("Succes!");
            } else if(user.activated === false) {
                req.session.loggedin = false;
                req.session.username = "";
                res.status(401);
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
                res.status(401);
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
                    res.status(401);
                    res.send("Account is already activated");
                }
            }
        });
    });

    app.post('/register', function(req, res) {
        //TODO Dit moet makkelijker kunnen dan 2 findOne's in elkaar, weet even niet hoe
        User.findOne({email: req.body.email}, function(err, user) {
            if(user === null || user === undefined) {
                User.findOne({username: req.body.username}, function(err, user) {
                    if(user === null || user === undefined) {
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
                                res.send("Error registering, missing data");
                            } else {
                                res.status(200);
                                res.send("Account registered");

                                //Email user
                                var mailOptions = {
                                    from: 'Socket Designer <dwasdeu@gmail.com>', // sender address
                                    to: req.body.email, // list of receivers
                                    subject: 'Confirm your account ' + req.body.firstName, // Subject line
                                    text: "Please confirm your Socket Designer account", // plaintext body
                                    html: "<p>Please confirm your Socket Designer account</p> </p><a href='http://localhost:13000/#/home/" + req.body.email + "/" + req.body.confirmationLink + "'>Confirm your account</a>" // html body
                                };

                                transporter.sendMail(mailOptions, function(error, info){
                                    if(error){
                                        return console.log(error);
                                    }
                                    console.log('Message sent: ' + info.response);
                                });
                            }
                        });
                    } else {
                        res.status(401);
                        res.send("Username already exists");
                    }
                });
            } else {
                res.status(401);
                res.send("Email already exists");
            }
        });
    });

    //TODO Dit is voor het testen van het opslaan van de projecten op de code generator pagina, moet later vervanngen worden
    app.post('/projectTest', function(req, res) {
        var project = new Project({
            code_id: 4,
            projectname: "test",
            username: "test",
            code: req.body.code,
            date: "2015-5-5"
        });

        project.save(function(err) {
            if(err) {
               return console.log(error);
            }
            res.status(200);
            res.send("Toegevoegd");
        });
    });

    app.get('/projectTest', function(req, res) {
        Project.findOne({code_id: 4}, function(err, project) {
            res.status(200);
            res.send(project.code);
        });
    })
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