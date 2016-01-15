var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        validate: [     // checks the length of the username. It has to be min. 3 and max. 15 characters long.
            function(username) {
                return username.length >= 3 && username.length <= 15;
            },
            "Username is too long or too short"
        ]
    },
    password:{
        type: String,
        required: true,
        validate: [     // checks the length of the password. It has to be min. 3 and max. 32 characters long.
            function(password) {
                return password.length === 32;
            },
            "Password is too long or too short"
        ]
    },
    email: {
        type: String,
        required: true,
        validate: [     // checks if the email has an @
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