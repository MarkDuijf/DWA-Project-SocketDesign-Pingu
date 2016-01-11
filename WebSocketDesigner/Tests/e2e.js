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

    this.timeout(120000);
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
            .waitForVisible('#logInButton', 60000)
            .click('#logInButton')
            .waitForVisible('#logInButtonForm', 60000)
            .click('#logInButtonForm')
            .waitForVisible('#loginError', 60000)
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
            .waitForVisible('#registerButton', 60000)
            .click('#registerButton')
            .setValue('#firstName', 'John')
            .setValue('#lastName', 'Doe')
            .setValue('#username', 'Tester')
            .setValue('#password', 'abc123')
            .setValue('#email', 'iets@iets.nl')
            .click('#registerButtonForm')
            .waitForVisible('#topMessage', 60000)
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
            .waitForVisible('#logInButton', 60000)
            .click('#logInButton')
            .setValue('#usernameLogin', 'Tester')
            .getValue('#usernameLogin').then(function(value) {
                expect(value).to.be.a("string");
            })
            .setValue('#passwordLogin', 'abc123')
            .getValue('#passwordLogin').then(function(value) {
                expect(value).to.be.a("string");
            })
            .waitForVisible('#logInButtonForm', 60000)
            .click('#logInButtonForm')
            .waitForVisible('#loginError', 60000)
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
            .waitForVisible('#logInButton', 60000)
            .click('#logInButton')
            .setValue('#usernameLogin', 'test')
            .getValue('#usernameLogin').then(function(value) {
                expect(value).to.be.a("string");
            })
            .setValue('#passwordLogin', 'ww')
            .getValue('#passwordLogin').then(function(value) {
                expect(value).to.be.a("string");
            })
            .waitForVisible('#logInButtonForm', 60000)
            .click('#logInButtonForm')
            .waitForVisible('#logOutButton', 60000).then( function(result) {
                done();
            });
    });

    it("Should visit the my account page", function(done) {
        browser
            .url("http://localhost:13000")
            .waitForVisible('#accountButton', 60000)
            .click('#accountButton')
            .waitForVisible('#changeEmail', 60000).then( function(result) {
                done();
            });
    });

    it("Should save generator code", function(done) {
        browser
            .url("http://localhost:13000/#/codeGenerator")
            .waitForVisible('#generatorSaveButton', 60000)
            .click('#generatorSaveButton')
            .waitForVisible('#projectName', 60000)
            .setValue('#projectName', "E2E Project")
            .waitForVisible('#saveButton', 60000)
            .click('#saveButton')
            .waitForVisible('#topMessage', 60000)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Your project has been saved.');
                done();
            });
    });

    it("Should load the previously made generator code", function(done) {
        browser
            .url("http://localhost:13000/#/codeGenerator")
            .waitForVisible('#generatorLoadButton', 60000)
            .click('#generatorLoadButton')
            .waitForVisible('#codeModal', 60000)
            .click(".codeKiesveld*=E2E Project").then(function(result) {
                done();
            });
    });

    it("Should load an earlier project called E2E test from the account page", function(done) {
        browser
            .url("http://localhost:13000/")
            .waitForVisible('#accountButton', 60000)
            .click('#accountButton')
            .waitForVisible(".codeKiesveld*=E2E Project", 60000)
            .click(".codeKiesveld*=E2E Project")
            .waitForVisible('#topMessage', 60000)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Your project has been loaded!');
                done();
            });
    });

    it("Should rename the project called E2E test on the account page", function(done) {
        browser
            .url("http://localhost:13000/")
            .waitForVisible('#accountButton', 60000)
            .click('#accountButton')
            .waitForVisible(".btn-primary*=Rename", 60000)
            .click(".btn-primary*=Rename")
            .waitForVisible('#newName', 60000)
            .setValue('#newName', 'Renamed')
            .click("#updateProjectName")
            .waitForVisible(".codeKiesveld*=Renamed", 60000).then( function(result) {
                done();
            });
    });

    it("Should delete the project called Renamed on the account page", function(done) {
        browser
            .url("http://localhost:13000/")
            .waitForVisible('#accountButton', 60000)
            .click('#accountButton')
            .waitForVisible(".btn-danger*=Delete", 60000)
            .click(".btn-danger*=Delete")
            .waitForVisible('#confirmDeleteProject', 60000)
            .click("#confirmDeleteProject").then( function(result) {
                done();
            });
    });

    it("Should log the user out", function(done) {
        browser
            .url("http://localhost:13000/")
            .waitForVisible('#logOutButton', 60000)
            .click('#logOutButton')
            .waitForVisible("#logInButton", 60000).then( function(result) {
                done();
            });
    });

    it("Should send a message via the contact form", function(done) {
        browser
            .url("http://localhost:13000")
            .setValue('#contactName', 'Naam')
            .setValue('#contactEmail', 'dwasdeu@gmail.com')
            .setValue('#contactMessage', 'Test message 123')
            .waitForVisible('#contactButton', 60000)
            .click('#contactButton')
            .waitForVisible('#topMessage', 60000)
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Message has been sent!');
                done();
            });
    });

    after(function(done) {
        mongoose.connect('mongodb://localhost/' + dbName, function(){
            User.remove({username: 'Tester'}, function(err, result) {
                if(err) { throw err; }
                console.log("E2E Tester removed");
            });
            Project.remove({username: 'test', projectName: 'Renamed'}, function(err, result) {
                if(err) {throw err;}
                console.log("E2E Project removed")
            })
        });
        browser.end(done);
    });


});