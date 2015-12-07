/**
 * Created by sebastiaan on 25-11-2015.
 */
var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        validate: [
            function(username) {
                return username.length >= 3 && username.length <= 15;
            },
            "Username is too long or too short"
        ]
    },
    password:{
        type: String,
        required: true,
        validate: [
            function(password) {
                return password.length >= 3 && password.length <= 15;
            },
            "Password is too long or too short"
        ]
    },
    email: {
        type: String,
        required: true,
        validate: [
            function(email) {
                var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return re.test(email);
            },
            "Email address is not valid"
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