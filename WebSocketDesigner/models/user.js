/**
 * Created by sebastiaan on 25-11-2015.
 */
var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        validate: [     // controle of de gebruikersnaam minimaal 3 en maximaal 15 tekens lang is
            function(username) {
                return username.length >= 3 && username.length <= 15;
            },
            "Username is too long or too short"
        ]
    },
    password:{
        type: String,
        required: true,
        validate: [     // controle of het wachtwoord minimaal 3 en maximaal 15 tekens lang is
            function(password) {
                return password.length >= 3 && password.length <= 15;
            },
            "Password is too long or too short"
        ]
    },
    email: {
        type: String,
        required: true,
        validate: [     // controle of het emailadres een @ bevat en goed eindigt (bijv. .com of .nl)
            function(email) {
                var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //Regex voor een goed email adres
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