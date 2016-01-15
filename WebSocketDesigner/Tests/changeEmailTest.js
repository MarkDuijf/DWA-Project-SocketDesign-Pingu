var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

describe('If the user wants to change the email', function(){

    it('an invalid email must be declined', function(done){
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

    it('an empty email input field must be declined', function(done){
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

    it('an already existing email must be declined', function(done){
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

    it('a valid email must be accepted',function(done){
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