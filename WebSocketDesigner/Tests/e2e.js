/**
 * Created by developer on 1-12-15.
 */
// required libraries
var webdriverio = require('webdriverio');
var expect = require('chai').expect;

var mongoose    = require('mongoose');
var dbName      = "socketDesignerDB";
var User        = require('../clientside/models/user');

mongoose.connect('mongodb://localhost/' + dbName, function(){
    User.remove({username: 'Tester'}, function(err, result) {
        if(err) { throw err; }
        console.log("Tester removed");
    });
});

describe("Selenium Tests - Login and Register", function() {

    this.timeout(45000);
    var browser;

    before( function (done) {
        // load the driver for browser
        browser = webdriverio.remote({
            desiredCapabilities: {
                browserName: 'firefox'
            }
        });
        browser.init(done);
    });

    it("Should get an username/password doesn't exist error", function(done) {
        browser
            .url("http://localhost:13000")
            .click('#logInButton')
            .click('#logInButtonForm')
            .waitForVisible('#topMessage', 1500)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Error: Wrong username/password');
                done();
            });
    });

    it("Should get a wrong/missing data error", function(done) {
        browser
            .url("http://localhost:13000")
            .click('#registerButton')
            .click('#registerButtonForm')
            .waitForVisible('#topMessage', 1500)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Error registering, missing/wrong data');
                done();
            });
    });


    it("Should get an username/password doesn't exist error", function(done) {
        browser
            .url("http://localhost:13000")
            .click('#logInButton')
            .click('#logInButtonForm')
            .waitForVisible('#topMessage', 1500)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Error: Wrong username/password');
                done();
            });
    });

    it("Should register an user with the username Tester", function(done) {
        browser
            .url("http://localhost:13000")
            .click('#registerButton')
            .setValue('#firstName', 'John')
            .setValue('#lastName', 'Doe')
            .setValue('#username', 'Tester')
            .setValue('#password', 'abc123')
            .setValue('#email', 'iets@iets.nl')
            .click('#registerButtonForm')
            .waitForVisible('#topMessage', 1500)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Succes, an email with a confirmation link has been sent.');
                done();
            });
    });

    it("Should give a not yet activated error for an user with the username Tester", function(done) {
        browser
            .url("http://localhost:13000")
            .click('#logInButton')
            .setValue('#usernameLogin', 'Tester')
            .getValue('#usernameLogin').then(function(value) {
                expect(value).to.be.a("string");
            })
            .setValue('#passwordLogin', 'abc123')
            .getValue('#passwordLogin').then(function(value) {
                expect(value).to.be.a("string");
            })
            .click('#logInButtonForm')
            .waitForVisible('#topMessage', 1500)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Not yet activated');
                done();
            });
    });

    it("Should log the user called test in", function(done) {
        browser
            .url("http://localhost:13000")
            .click('#logInButton')
            .setValue('#usernameLogin', 'test')
            .getValue('#usernameLogin').then(function(value) {
                expect(value).to.be.a("string");
            })
            .setValue('#passwordLogin', 'test')
            .getValue('#passwordLogin').then(function(value) {
                expect(value).to.be.a("string");
            })
            .click('#logInButtonForm')
            .waitForVisible('#topMessage', 1500)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('You have been logged in');
                done();
            });
    });

    after(function(done) {
        browser.end(done);
    });


});