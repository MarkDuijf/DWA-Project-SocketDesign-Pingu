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
var User        = require('../models/user.js');

describe('Als een gebruiker wil registreren moet', function(){

    xit('een fout e-mailadres geweigerd worden', function(done){
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
            .expect(401)
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
            password: 'DuijfDuijfDuijfDuijfDuijfDuijfDu',
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

    xit('een gebruikt e-mailadres geweigerd worden', function(done){
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
            .expect(409)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Email already exists");
                done();
            });
    });

    xit('een te korte gebruikersnaam geweigerd worden', function(done){
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
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    xit('een te lange gebruikersnaam geweigerd worden', function(done){
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
            .expect(401)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });

    xit('een gebruiksnaam langer dan 3 en korter dan 15 tekens geaccepteerd worden', function(done){
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
            .expect(201)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
            expect(err).to.be.null;
            expect(res.text).to.equal("Account registered");
            done();
        });
    });

    xit('een gebruikersnaam die al gebruikt is geweigerd worden', function(done) {
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
            .expect(409)
            .expect('Content-Type', /text\/html/)
            .end(function(err,res) {
                expect(err).to.be.null;
                expect(res.text).to.equal("Username already exists");
                done();
            });
    });

});
