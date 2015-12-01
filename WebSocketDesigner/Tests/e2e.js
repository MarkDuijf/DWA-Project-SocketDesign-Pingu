/**
 * Created by developer on 1-12-15.
 */
// required libraries
var webdriverio = require('webdriverio');
var expect = require('chai').expect;

describe("My First Selenium Test", function() {

    this.timeout(30000);
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

    it("Should get an error", function(done) {
        browser
            .url("http://localhost:13000")
            .click('#logInButton')
            .click('#logInButtonForm')
            .getText("#topMessage").then( function(result) {
                console.log("Message is: ", result);
                expect(result).to.be.a("string");
                expect(result).to.have.string('Error: Wrong username/password');
                done();
            });
    });

    it("Should fill in the form", function(done) {
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
            .click('#logInButtonForm').then(function(result) {
                done();
            })
    });

    after(function(done) {
        browser.end(done);
    });


});