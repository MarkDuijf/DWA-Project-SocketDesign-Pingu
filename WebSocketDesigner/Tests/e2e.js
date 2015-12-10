/**
 * Created by developer on 1-12-15.
 */
// required libraries
var webdriverio = require('webdriverio');
var expect      = require('chai').expect;

var mongoose    = require('mongoose');
var dbName      = "socketDesignerDB";
var User = require('./../models/user');
var Project = require('./../models/project');

describe("Selenium Tests - Login, Register and Contact", function() {

    this.timeout(90000);
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
            .waitForVisible('#loginError', 5000)
            .getText("#loginError").then( function(result) {
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
            .waitForVisible('#topMessage', 5000)
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
            .waitForVisible('#loginError', 5000)
            .getText("#loginError").then( function(result) {
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
            .waitForVisible('#topMessage', 5000)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('You have been logged in');
                done();
            });
    });

    it("Should send a message via the contact form", function(done) {
        browser
            .url("http://localhost:13000")
            .setValue('#contactName', 'Naam')
            .setValue('#contactEmail', 'dwasdeu@gmail.com')
            .setValue('#contactMessage', 'Test message 123')
            .click('#contactButton')
            .waitForVisible('#topMessage', 5000)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Message has been sent!');
                done();
            });
    });

    it("Should save generator code", function(done) {
        browser
            .url("http://localhost:13000/#/codeGenerator")
            .click('#generatorSaveButton')
            .setValue('#projectName', "E2E Project")
            .click('#saveButton')
            .waitForVisible('#topMessage', 5000)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Your project has been saved.');
                done();
            });
    });

    after(function(done) {
        mongoose.connect('mongodb://localhost/' + dbName, function(){
            User.remove({username: 'Tester'}, function(err, result) {
                if(err) { throw err; }
                console.log("E2E Tester removed");
            });
            Project.remove({projectname: 'E2E Project'}, function(err, result) {
                if(err) {throw err;}
                console.log("E2E Project removed")
            })
        });
        browser.end(done);
    });


});