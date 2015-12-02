/**
 * Created by sebastiaan on 25-11-2015.
 */
var mongoose = require('mongoose');


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
        required: true,
        validate: [
            function(email) {
                if(email.indexOf('@') === -1)
                {
                    return false;
                } else {
                    return true;
                }
            },
            "Doesn't have a @"
        ]
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    confirmationLink: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);