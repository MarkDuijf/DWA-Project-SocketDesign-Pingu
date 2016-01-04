/**
 * Created by sebastiaan on 4-1-2016.
 */
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe('Als een gebruiker zijn/haar wachtwoord wil veranderen', function(){
    it('een te lang wachtwoord geweigerd worden', function(done){

        var change = {
            username: 'test',
            password: 'test',
            newPass: 'dit is een veel te lang wachtwoord',
            newPassR: 'dit is een veel te lang wachtwoord'
        };

        agent
            .post('/confirmPasswordChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Data error");
                done();
            });
    });

    it('een te kort wachtwoord geweigerd worden', function(done){

        var change = {
            username: 'test',
            password: 'test',
            newPass: 'jo',
            newPassR: 'jo'
        };

        agent
            .post('/confirmPasswordChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal("Data error");
                done();
            });
    });

    it('een wachtwoord geweigerd worden als de herhaling niet hetzelfde is als het eerste vernieuwde wachtwoord', function(done){

        var change = {
            username: 'test',
            password: 'test',
            newPass: 'wachtwoord',
            newPassR: 'wachtwoord1'
        };

        agent
            .post('/confirmPasswordChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal("Data error");
                done();
            });
    });

    it('een wachtwoord geweigerd worden als de ingevoerde waarde \'\' is', function(done){

        var change = {
            username: 'test',
            password: 'test',
            newPass: '',
            newPassR: 'wachtwoord'
        };

        agent
            .post('/confirmPasswordChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal("Data error");
                done();
            });
    });

    it('een wachtwoord geweigerd worden als de herhaling de waarde \'\' heeft', function(done){

        var change = {
            username: 'test',
            password: 'test',
            newPass: 'wachtwoord',
            newPassR: ''
        };

        agent
            .post('/confirmPasswordChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(400)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal("Data error");
                done();
            });
    });

    it('moet een geldig wachtwoord geaccepteerd worden', function(done){

        var change = {
            username: 'test',
            password: 'test',
            newPass: 'wachtwoord',
            newPassR: 'wachtwoord'
        };

        agent
            .post('/confirmPasswordChange')
            .send(change)
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res){
                expect(err).to.be.null;
                expect(res.text).to.equal(change.newPass);
                done();
            });
    });
});