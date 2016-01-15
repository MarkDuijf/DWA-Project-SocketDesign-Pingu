var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe("If the user wants to save a project", function() {
    it("an empty project name must be declined", function(done){
        var save = {
            username: "SebastiaanVonk",
            projectName: "",
            code: "Hier staat hele leuke code",
            date: "2015-10-12"
        };

        agent
            .post('/projects')
            .send(save)
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("No project name found");
                done();
            });
    });

    it("a too short project name must be declined", function(done) {

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
    });

    it("a too long project name must be declined", function(done) {

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

    it("a valid project name must be accepted", function(done){

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

    it("an empty code input field must be declined", function(done) {

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

});
