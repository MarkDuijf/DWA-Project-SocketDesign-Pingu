/**
 * Created by sebastiaan on 27-11-2015.
 */

var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

var mongoose    = require('mongoose');
var dbName      = "socketDesignerDB";
var User        = require('../clientside/models/user');

describe('Als een gebruiker wil registreren moet', function(){

    it('een fout e-mailadres geweigerd worden', function(done){
        var register = {
            username: 'SebastiaanVonk',
            password: 'testtest',
            email: 'asdfg',
            firstName: 'Sebastiaan',
            lastName: 'Vonk',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(500)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('een goed e-mailadres geen problemen hebben', function(done){
        var register = {
            username: 'Mark',
            password: 'Duijf',
            email: 'MarkDuif@student.han.nl',
            firstName: 'Mark',
            lastName: 'Duijf',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Account registered");
                done();
            });
    });

    it('een gebruikt e-mailadres geweigerd worden', function(done){
        var register = {
            username: 'Mark',
            password: 'Duijf',
            email: 'MarkDuif@student.han.nl',
            firstName: 'Mark',
            lastName: 'Duijf',
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
                expect(res.text).to.equal("Email already exists");
                done();
            });
    });

    it('een te korte gebruikersnaam geweigerd worden', function(done){
        var register = {
            username: 'jo',
            password: 'testtest',
            email: 'SebastiaanVonk@student.han.nl',
            firstName: 'Sebastiaan',
            lastName: 'Vonk',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(500)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('een te lange gebruikersnaam geweigerd worden', function(done){
        var register = {
            username: 'VincentvanRossum',
            password: 'testtest',
            email: 'VD.vanRossum@student.han.nl',
            firstName: 'Vincent',
            lastName: 'van Rossum',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(500)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('een gebruiksnaam langer dan 3 en korter dan 15 tekens geaccepteerd worden', function(done){
        var register  = {
            username: 'SamvanGeijn',
            password: 'testtest',
            email: 'samvanGeijn@student.han.nl',
            firstName: 'Sam',
            lastName: 'van Geijn',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
            expect(err).to.be.null;
            expect(res.text).to.equal("Account registered");
            done();
        });
    });

    it('een gebruikersnaam die al gebruikt is geweigerd worden', function(done) {
        var register  = {
            username: 'SamvanGeijn',
            password: 'testtest',
            email: 'samvGeijn@student.han.nl',
            firstName: 'Sam',
            lastName: 'van Geijn',
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
                expect(res.text).to.equal("Username already exists");
                done();
            });
    });

    it('een te kort wachtwoord geweigerd worden', function(done) {
        var register  = {
            username: 'EricJans',
            password: 'jo',
            email: 'ericjans@student.han.nl',
            firstName: 'Eric',
            lastName: 'Jans',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(500)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('een te lang wachtwoord geweigerd worden', function(done) {
        var register  = {
            username: 'EricJans',
            password: 'Ditiseenheellangwachtwoord',
            email: 'ericjans@student.han.nl',
            firstName: 'Eric',
            lastName: 'Jans',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(500)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    it('een wachtwoord langer dan 3 en korter dan 15 tekens geaccepteerd worden', function(done) {
        var register  = {
            username: 'EricJans',
            password: 'wachtwoord',
            email: 'ericjans@student.han.nl',
            firstName: 'Eric',
            lastName: 'Jans',
            confirmationLink: 'www.han.nl'
        };

        agent
            .post('/register')
            .send(register)
            .set('Content-Type', 'application/json')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Account registered");

                mongoose.connect('mongodb://localhost/' + dbName, function(){
                    User.remove({username: 'EricJans'}, function(err, result) {
                        if(err) { throw err; }
                    });

                    User.remove({username: 'SebastiaanVonk'}, function(err, result) {
                        if(err) { throw err; }
                    });

                    User.remove({username: 'Mark'}, function(err, result) {
                        if(err) { throw err; }
                    });

                    User.remove({username: 'jo'}, function(err, result) {
                        if(err) { throw err; }
                    });

                    User.remove({username: 'VincentvanRossum'}, function(err, result) {
                        if(err) { throw err; }
                        console.log("Tester removed");
                    });

                    User.remove({username: 'SamvanGeijn'}, function(err, result) {
                        if(err) { throw err; }
                    });
                });

                done();
            });
    });
});
