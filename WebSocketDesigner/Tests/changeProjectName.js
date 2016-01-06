/**
 * Created by sebastiaan on 6-1-2016.
 */
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe("Als een gebruiker zijn/haar project een andere naam wil geven", function(){

    it('moet een te korte projectnaam geweigerd worden', function(done){
        var change = {
            projectname: 'My Project',
            newProjectName: 'jo'
        };

        agent
            .post('/changeName')
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

    it('moet een te lange projectnaam geweigerd worden', function(done){
        var change = {
            projectname: 'My Project',
            newProjectName: 'dit is een veel te lange projectnaam'
        };

        agent
            .post('/changeName')
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

    it('moet een geldige projectnaam geaccepteerd worden', function(done){
        var change = {
            projectname: 'My Project',
            newProjectName: 'testnaam'
        };

        agent
            .post('/changeName')
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