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
            projectName: "jo",
            code: "Hier staat hele leuke code",
            date: "2015-10-12"
        };

        agent
            .post('/projects')
            .send(save)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Projectname is too long or too short");
                done();
            });
        console.log(save);
    });

    it("een te lange projectnaam geweigerd worden", function(done) {

        var save = {
            username: "SebastiaanVonk",
            projectName: "Eenveeltelangenaam",
            code: "Hier staat hele leuke code",
            date: "2015-10-12"
        };

        agent
            .post('/projects')
            .send(save)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal("Projectname is too long or too short");
                done();
            });
    });

    it("een projectnaam van minstens 3 en maximaal 15 tekens geaccepteerd worden", function(done){

        var save = {
            username: "SebastiaanVonk",
            projectName: "Een projectnaam",
            code: "Hier staat hele leuke code",
            date: "2015-10-12"
        };

        agent
            .post('/projects')
            .send(save)
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal("Saved the project");
                done();
            });
    });

    it("een leeg codeblok geweigerd worden", function(done) {

        var save = {
            username: "SebastiaanVonk",
            projectName: "Een project",
            code: "",
            date: "2015-10-12"
        };

        agent
            .post('/projects')
            .send(save)
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal("No code found");
                done();
            });
    });

    xit("dan moet goede code zonder problemen opgeslagen worden",function(done){

    });

    xit("dan moet ik een melding ontvangen of ik het zeker weet, wanneer de code fouten bevat", function(done){

    });

});
