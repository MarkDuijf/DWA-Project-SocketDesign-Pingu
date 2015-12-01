var mongoose = require('mongoose');

var dbName = "socketDesignerDB";
var users = require('testUsers.json');
var projects = require('testProjects.json');

var User = require('./user');
var Project = require('./project');

mongoose.connect('mongodb://localhost/' + dbName, function(){
    User.remove({}, function(){
        User.create(users, function(){
            console.log('done!');
        })
    })

    Project.remove({}, function(){
        Project.create(projects, function(){
            console.log('done!');
        })
    })
});