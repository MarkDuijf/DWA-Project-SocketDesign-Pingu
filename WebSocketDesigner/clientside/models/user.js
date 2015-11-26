/**
 * Created by sebastiaan on 25-11-2015.
 */
var mongoose = require('mongoose');

//var projectSchema = require('./project');

var userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);