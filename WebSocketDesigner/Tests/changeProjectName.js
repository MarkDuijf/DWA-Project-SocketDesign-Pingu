var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe("If the user wants to change the project name", function(){

    it('a too short name must be declined', function(done){
        var change = {
            projectname: 'My Project',
            newProjectName: 'jo'
        };

        agent
            .post('/changeProjectName')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Your project name is too long or too short");
                done();
            });
    });

    it('a too long name must be declined', function(done){
        var change = {
            projectname: 'My Project',
            newProjectName: 'dit is een veel te lange projectnaam'
        };

        agent
            .post('/changeProjectName')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Your project name is too long or too short");
                done();
            });
    });

    it('a valid name must be accepted', function(done){
        var change = {
            projectname: 'My Project',
            newProjectName: 'testnaam'
        };

        agent
            .post('/changeProjectName')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal(change.newProjectName);
                done();
            });
    })

});