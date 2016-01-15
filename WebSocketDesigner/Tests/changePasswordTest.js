var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe('If the user wants to change the password', function(){
    it('a too long password must be declined', function(done){

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

    it('a too short password must be declined', function(done){

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

    it('a different second password must be declined', function(done){

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

    it('an empty password field must be declined', function(done){

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

    it('an empty second password field must be declined', function(done){

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

    it('a valid password must be accepted', function(done){

        var change = {
            username: 'test',
            password: 'test',
            newPass: '0d40d9aea2b3b5a149dc34495fff0a0a',
            newPassR: '0d40d9aea2b3b5a149dc34495fff0a0a'
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