var mongoose = require('mongoose');

var dbName = "socketDesignerDB";
var users = require('./testUsers');
var projects = require('./testProjects');

var User = require('../user');
var Project = require('../project');

mongoose.connect('mongodb://localhost/' + dbName, function(){
    User.remove({}, function(){
        User.create(users, function(){
            console.log('Users inserted in DB!');
        })
    });

    Project.remove({}, function(){
        Project.create(projects, function(){
            console.log('Projects inserted in DB!');
        })
    })
});