/**
 * Created by sebastiaan on 27-11-2015.
 */
var mongoose = require("mongoose");

var UserAccount = new mongoose.Schema({
    user_name       : { type: String, required: true, lowercase: true, trim: true, index: { unique: true }, validate: [ validateEmail, "Email is not a valid email."]  },
    password        : { type: String, required: true },
    date_created    : { type: Date, required: true, default: Date.now }
});

// Email Validator
function validateEmail (val) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val);
}

var validator = require('./validators')

// Example test
describe("validateEmail", function(){
    it("should return false when invalid email", function(){
        validator.validateEmail('asdf').should.equal(false)
    })
})