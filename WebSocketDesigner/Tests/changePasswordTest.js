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
            newPass: 'dit is een veel te lang wachtwoord'
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
});