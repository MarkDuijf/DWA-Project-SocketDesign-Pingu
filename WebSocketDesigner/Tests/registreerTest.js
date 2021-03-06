
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

var mongoose    = require('mongoose');
var dbName      = "socketDesignerDB";
var User        = require('../models/user.js');

describe('If a user wants to register', function(){

    it('a wrong email must be declined', function(done){
        var register = {
            username: 'SebastiaanVonk',
            password: '2c729497d91709de6bf1ccd875cf28e5',
            email: 'asdfg',
            firstName: 'Sebastiaan',
            lastName: 'Vonk',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('an empty first name must be declined', function(done){
        var register = {
            username: 'SebastiaanVonk',
            password: '2c729497d91709de6bf1ccd875cf28e5',
            email: 'SebastiaanVonk@student.han.nl',
            firstName: '',
            lastName: 'Vonk',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('an empty last name must be declined', function(done){
        var register = {
            username: 'SebastiaanVonk',
            password: '2c729497d91709de6bf1ccd875cf28e5',
            email: 'SebastiaanVonk@student.han.nl',
            firstName: 'Sebastiaan',
            lastName: '',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('a right email must be accepted', function(done){
        var register = {
            username: 'Mark',
            password: '2c729497d91709de6bf1ccd875cf28e5',
            email: 'MarkDuif@student.han.nl',
            firstName: 'Mark',
            lastName: 'Duijf',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(201)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Account registered");
                done();
            });
    });

    it('an already used email must be declined', function(done){
        var register = {
            username: 'Mark',
            password: '2c729497d91709de6bf1ccd875cf28e5',
            email: 'MarkDuif@student.han.nl',
            firstName: 'Mark',
            lastName: 'Duijf',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(409)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Email already exists");
                done();
            });
    });

    it('a too short username must be declined', function(done){
        var register = {
            username: 'jo',
            password: '2c729497d91709de6bf1ccd875cf28e5',
            email: 'SebastiaanVonk@student.han.nl',
            firstName: 'Sebastiaan',
            lastName: 'Vonk',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('a too long username must be declined', function(done){
        var register = {
            username: 'VincentvanRossum',
            password: '2c729497d91709de6bf1ccd875cf28e5',
            email: 'VD.vanRossum@student.han.nl',
            firstName: 'Vincent',
            lastName: 'van Rossum',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('a valid username must be accepted', function(done){
        var register  = {
            username: 'SamvanGeijn',
            password: '2c729497d91709de6bf1ccd875cf28e5',
            email: 'samvanGeijn@student.han.nl',
            firstName: 'Sam',
            lastName: 'van Geijn',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(201)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
            expect(err).to.be.null;
            expect(res.text).to.equal("Account registered");
            done();
        });
    });

    it('an already used usernamer must be declined', function(done) {
        var register  = {
            username: 'SamvanGeijn',
            password: '2c729497d91709de6bf1ccd875cf28e5',
            email: 'samvGeijn@student.han.nl',
            firstName: 'Sam',
            lastName: 'van Geijn',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(409)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Username already exists");

                mongoose.connect('mongodb://localhost/' + dbName, function(){
                    User.remove({username: 'EricJans'}, function(err, result) {
                        if(err) { throw err; }
                    });
                });

                User.remove({username: 'Mark'}, function(err, result) {
                    if(err) { throw err; }
                });

                User.remove({username: 'SamvanGeijn'}, function(err, result) {
                    if(err) { throw err; }
                });

                done();
            });
    });

});
