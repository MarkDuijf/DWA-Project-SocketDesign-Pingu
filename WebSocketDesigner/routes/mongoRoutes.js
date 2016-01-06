/**
 * Created by developer on 8-12-15.
 */
module.exports = function (app) {
    "use strict";
    require('body-parser');
    var session = require("express-session");
    var nodemailer = require('nodemailer');

    var mongoose = require('mongoose');
    var dbName = "socketDesignerDB";
    var User = require('./../models/user');
    var Project = require('./../models/project');

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dwasdeu@gmail.com',
            pass: 'pingusdeu'
        }
    });

    app.get('/getLoggedIn', function(req, res) {
        var response = {};
        if(req.session.username !== undefined && req.session.username !== null && req.session.username !== "") {
            response.loggedIn = "Logged in";
            response.username = req.session.username;
            response.firstName = req.session.firstName;
            res.status(200);
            res.send(response);
        } else {
            response.loggedIn = "Not logged in";
            res.status(200);
            res.send(response);
        }
    });

    mongoose.connect('mongodb://localhost/' + dbName, function () {
        // Gebruikt om een gebruiker in te loggen
        app.get('/login', function(req, res) {
            res.status(200);
            res.send(req.session.loggedin);
        });

        app.post('/login', function (req, res) {
            User.findOne({
                username: req.body.username,
                password: req.body.password
            }, function (err, user) {
                if (err) {
                    console.log(err);
                    req.session.loggedin = false;
                    req.session.username = "";
                    res.status(500);
                    res.send("Server error");
                } else if (user === null) {
                    //Als een gebruiker niet gevonden kan worden met de ingevoerde gebruikersnaam en wachtwoord
                    req.session.loggedin = false;
                    req.session.username = "";
                    res.status(404);
                    res.send("Wrong username/password");
                } else if (user.activated === true) {
                    req.session.loggedin = true;
                    req.session.username = req.body.username;
                    req.session.firstName = user.firstName;
                    res.status(200);
                    res.send(user.firstName);
                } else if (user.activated === false) {
                    req.session.loggedin = false;
                    req.session.username = "";
                    res.status(403);
                    res.send("Not yet activated");
                } else {
                    req.session.loggedin = false;
                    req.session.username = "";
                    res.status(500);
                    res.send("Other reason");
                }
            });
        });

        app.post('/logout', function (req, res) {
            req.session.loggedIn = false;
            req.session.username = "";
            res.status(200);
            res.send("Uitgelogd");
        });

        //Gebruikt om een account te activeren, gebruikers krijgen na het registreren een mail met een link naar deze route
        app.post('/confirm', function (req, res) {
            User.findOne({
                email: req.body.email,
                confirmationLink: req.body.confirmation
            }, function (err, user) {
                if (user === null || user === undefined) {
                    res.status(404);
                    res.send("Confirmation failed, account doesn't exist");
                } else {
                    if (user.activated === false) {
                        User.update({
                            email: req.body.email,
                            confirmationLink: req.body.confirmation
                        }, {
                            $set: {
                                activated: true
                            }
                        }, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500);
                                res.send("Couldn't set activated to true");
                            } else {
                                //console.log(result);
                                res.status(200);
                                res.send("The account has been activated");
                            }
                        });
                    } else if (user.activated === true) {
                        res.status(401);
                        res.send("Account is already activated");
                    }
                }
            });
        });

        //Gebruikt om een gebruiker te registreren, checkt eerst of er al iemand bestaat met hetzelfde email adres of gebruikersnaam
        app.post('/register', function (req, res) {
            //TODO Dit moet makkelijker kunnen dan 2 findOne's in elkaar, weet even niet hoe
            User.findOne({
                email: req.body.email
            }, function (err, user) {
                if (user === null || user === undefined) {
                    User.findOne({
                        username: req.body.username
                    }, function (err, user) {
                        if (user === null || user === undefined) {
                            var registerUser = new User({
                                username: req.body.username,
                                password: req.body.password,
                                email: req.body.email,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                confirmationLink: req.body.confirmationLink,
                                activated: false
                            });

                            registerUser.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    res.status(401);
                                    res.send("Error registering, missing/wrong data");
                                } else {
                                    res.status(201);
                                    res.send("Account registered");

                                                                                                        // Email user
                                    var mailOptions = {
                                        from: 'Socket Designer <dwasdeu@gmail.com>',                    // sender address
                                        to: req.body.email,                                             // list of receivers
                                        subject: 'Confirm your account ' + req.body.firstName,          // Subject line
                                        text: "Please confirm your Socket Designer account",            // plaintext body
                                        html: "<p>Please confirm your Socket Designer account</p> </p><a href='http://localhost:13000/#/home/" + req.body.email + "/" + req.body.confirmationLink + "'>Confirm your account</a>" // html body
                                    };

                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        //console.log('Message sent: ' + info.response);
                                    });
                                }
                            });
                        } else {
                            res.status(409);
                            res.send("Username already exists");
                        }
                    });
                } else {
                    res.status(409);
                    res.send("Email already exists");
                }
            });
        });

        //TODO Dit is voor het testen van het opslaan van de projecten op de code generator pagina, moet later vervanngen worden met het account systeem
        app.post('/projects', function (req, res) {                      // toevoegen van een project aan de database
            var datetime = new Date();
            //Voor unit test
            if (req.body.username !== undefined) {
                req.session.username = req.body.username;
                req.session.loggedin = true;
            }

            if (req.session.username === undefined || req.session.username === null || req.session.username === "") {
                /*Deze if is alleen voor het testen, met het account systeem wordt verder gebouwt op de else
                project = {
                    username: "test",
                    projectname: req.body.name,
                    code: req.body.code,
                    date: datetime
                };
                */
                res.status(400);
                res.send("No username found");
            } else if(req.body.projectName === undefined || req.body.projectName === null || req.body.projectName === "") {
                //console.log(req.body.name);
                res.status(400);
                res.send("No project name found");
            } else if(req.body.projectName.length < 3 || req.body.projectName.length > 15){
                res.status(401);
                res.send("Projectname is too long or too short");
            } else if(req.body.code === undefined || req.body.code === null || req.body.code === "") {
                res.status(400);
                res.send("No code found");
            } else {
                var project = {
                    username: req.session.username,
                    projectName: req.body.projectName,
                    code: req.body.code,
                    date: datetime
                };

                Project.findOneAndUpdate({username: req.session.username, projectName: req.body.projectName}, project, {upsert:true}, function(err, doc){
                    if (err) return res.send(500, { error: err });
                    return res.send("Saved the project");
                });
            }

            /* Werke niet vanwege upsert
            project.save(function (err) {
                if (err) {
                    res.status(401);
                    res.send("Error saving data, missing/wrong data")
                    return console.log(err);
                }
                res.status(200);
                res.send("Toegevoegd");
            });
            */
        });

        app.post('/projects/checkName', function(req,res) {
            Project.find({username: req.session.username, projectName: req.body.projectName}, function(err, projects){
                if(projects.length === 0) {
                    res.status(401);
                    res.send("Doesn't exist");
                } else {
                    res.status(200);
                    res.send("Exists");
                }
            });
        });

        app.get('/projects', function (req, res) {                       //Ophalen van alle projecten uit de database
            if(req.session.username === undefined || req.session.username === null || req.session.username === "") {
                //Deze if is alleen voor het testen, met het account systeem wordt verder gebouwt op de else
                Project.find({}, function (err, projects) {
                    if (err) {                                                   //Wanneer ophalen faalt geef error
                        console.log(err);
                        res.status(500);
                        res.send("Problem finding projects");
                    }                                      //Anders stuur het resultaat terug
                    res.status(200);
                    res.send(projects);
                });
            } else {
                Project.find({username: req.session.username}, function (err, projects) {
                    if (err) {                                                   //Wanneer ophalen faalt geef error
                        console.log(err);
                        res.status(500);
                        res.send("Problem finding projects");
                    }
                    //console.log(projects);                                      //Anders stuur het resultaat terug
                    res.status(200);
                    res.send(projects);
                })
            }
        });

        app.get('/projects/:id', function (req, res) {
                Project.findOne({_id: req.params.id}, function (err, project) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.send("Problem finding project");
                    } else if(project.username === req.session.username) {
                        var object = {
                            name: project.projectName,
                            code: project.code
                        }
                        res.status(200);
                        res.send(object);
                    } else if(project.username !== req.session.username) {
                        var object = {
                            name: "My Project",
                            code: ""
                        }
                        res.status(400);
                        res.send(object);
                    }
                });
        });

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

        app.post('/confirmEmailChange', function(req, res) {
            var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //Regex voor een goed email adres
            if(req.session.confirmationCode === req.body.confirmation && re.test(req.body.newEmail) === true) {
                User.find({email: req.body.newEmail}, function(err, results) {
                    if(results.length > 0) {
                        res.status(400);
                        res.send("Email already exists");
                    } else {
                        User.update({username: req.session.username, email: req.body.email}, {$set: { email: req.body.newEmail } }, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500);
                                res.send("Update error");
                            } else {
                                res.status(200);
                                res.send(req.body.newEmail);
                            }
                        });
                    }
                });
            } else {
                res.status(400);
                res.send("Invalid email");
            }
        });

        app.post('/confirmPasswordChange', function(req, res) {
            if(req.session.confirmationCode === req.body.confirmation && req.body.newPass === req.body.newPassR && req.body.newPass !== "" && req.body.newPassR !== "" && req.body.newPass.length === 32) {
                User.update({username: req.session.username}, {$set: { password: req.body.newPass } }, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.send("Update error");
                    } else {
                        req.session.loggedin = false;
                        req.session.username = "";
                        res.status(200);
                        res.send(req.body.newPass);
                    }
                });
            } else {
                res.status(400);
                res.send("Data error");
            }
        });
        app.post('/changeName', function(req, res){
            if(req.body.newProjectName.length < 3 || req.body.newProjectName.length > 15){
                res.status(401);
                res.send("Your project name is too long or too short");
            } else {
                Project.update({projectName: req.body.oldProjectName}, {$set: {projectName: req.body.newProjectName}}, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.send("Update error");
                    } else {
                        res.status(200);
                        res.send(req.body.newProjectName);
                    }
                })
            }
        });

        app.post('/deleteProject', function(req, res){
            Project.remove({projectName: req.body.project.projectName, username: req.session.username}, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send("Delete error");
                } else{
                    res.status(200);
                    res.send("deleted");
                }
            })
        })
    });

};