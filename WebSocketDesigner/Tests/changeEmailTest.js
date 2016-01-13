/**
 * Created by sebastiaan on 4-1-2016.
 */
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe('Als een gebruiker zijn/haar email-adres wil veranderen', function(){

    it('moet een ongeldig emailadres geweigerd worden', function(done){
        var change = {
            email: 'DWASDEU@gmail.com',
            newEmail: 'asdfg'
        };

        agent
            .post('/confirmEmailChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Invalid email");
                done();
            });

    });

    it('moet een leeg emailadresveld geweigerd worden', function(done){
        var change = {
            email: 'DWASDEU@gmail.com',
            newEmail: ''
        };

        agent
            .post('/confirmEmailChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Invalid email");
                done();
            });

    });

    it('moet een bestaand emailadres geweigerd worden', function(done){
        var change = {
            email: 'DWASDEU@gmail.com',
            newEmail: 'dwasdeu@gmail.com'
        };

        agent
            .post('/confirmEmailChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal("Email already exists");
                done();
            });
    });

    it('moet een geldig emailadres geaccepteerd worden',function(done){
        var change = {
            email: 'DWASDEU@gmail.com',
            newEmail: 'testtest@gmail.com'
        };

        agent
            .post('/confirmEmailChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal(change.newEmail);
                done();
            });
    });
});