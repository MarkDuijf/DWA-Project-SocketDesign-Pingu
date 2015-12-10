/**
 * Created by sebastiaan on 10-12-2015.
 */

var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe("Als een gebruiker een project wil opslaan moet", function() {
    it("een te korte projectnaam geweigerd worden", function(done) {

        var save = {
            username: "SebastiaanVonk",
            projectname: "jo",
            code_id: 4,
            code: "Hier staat hele leuke code",
            date: "2015-10-12"
        };

        agent
            .post('/projectTest')
            .send(save)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it("een te lange projectnaam geweigerd worden", function(done) {

        var save = {
            username: "SebastiaanVonk",
            projectname: "Eenveeltelangenaam",
            code_id: 4,
            code: "Hier staat hele leuke code",
            date: "2015-10-12"
        };

        agent
            .post('/projectTest')
            .send(save)
            .set('Content-Type', 'application.json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

});
