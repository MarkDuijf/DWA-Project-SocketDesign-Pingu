var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true,
        validate: [     // checks the length of the projectname. It has to be min. 3 and max. 15 characters long.
            function(projectName) {
                return projectName.length >= 3 && projectName.length <= 15;
            },
            "Projectname is too long or too short"
        ]
    },
    code: {
        type: String,
        required: true,
        validate: [     // checks if there is any code in the input field.
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