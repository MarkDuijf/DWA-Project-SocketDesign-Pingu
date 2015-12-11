/**
 * Created by sebastiaan on 25-11-2015.
 */
var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true,
        validate: [     // controle of de projectnaam minimaal 3 en maximaal 15 tekens lang is
            function(projectName) {
                return projectName.length >= 3 && projectName.length <= 15;
            },
            "Projectname is too long or too short"
        ]
    },
    code: {
        type: String,
        required: true,
        validate: [     // controle of er wel code ingevoerd wordt
            function(code) {
                return code.length > 0;
            },
            "You have to insert something"
        ]
    },
    date: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Project",projectSchema);