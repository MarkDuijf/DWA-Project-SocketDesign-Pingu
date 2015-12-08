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
        required: true
    },
    code_id: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Project",projectSchema);