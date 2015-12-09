/**
 * Created by sebastiaan on 25-11-2015.
 */
var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    projectname: {
        type: String,
        required: true,
        validate: [     // controle of de projectnaam minimaal 3 en maximaal 15 tekens lang is
            function(projectname) {
                return username.length >= 3 && username.length <= 15;
            },
            "Projectname is too long or too short"
        ]
    },
    code_id: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        validate: [     // controle of de projectnaam minimaal 3 en maximaal 15 tekens lang is
            function(code) {
                return username.length > 0;
            },
            "Projectname is too short"
        ]
    },
    date: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Project",projectSchema);