var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);


    describe('Als een gebruiker wil inloggen moet', function () {
        it('een fout wachtwoord geweigerd worden', function (done) {
            var login = {
                username: 'test',
                password: 'ad57484016654da87125db86f4227ea' // Bij het juiste wachtwoord voor de gebruikersnaam 'test' staat er nog een 3 achter.
            };

            agent
                .post('/login')
                .send(login)
                .set('Content-Type', 'application/json')
                .expect(404)
                .expect('Content-Type', /text\/html/)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.text).to.equal('Wrong username/password');
                    done();
                });
        });

        it('een leeg wachtwoord geweigerd worden', function(done) {
            var login = {
                username:'test',
                password: ''
            };

            agent
                .post('/login')
                .send(login)
                .set('Content-Type', 'application/json')
                .expect(404)
                .expect('Content-Type', /text\/html/)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.text).to.equal('Wrong username/password');
                    done();
                });
        });

        it('een verkeerde gebruikersnaam geweigerd worden', function(done){
            var login = {
                username: 'testest', // De juiste gebruikersnaam bij dit wachtwoord is test
                password: 'ad57484016654da87125db86f4227ea3'
            };

            agent
                .post('/login')
                .send(login)
                .set('Content-Type', 'application/json')
                .expect(404)
                .expect('Content-Type', /text\/html/)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.text).to.equal('Wrong username/password');
                    done();
                });
        });

        it('een lege gebruikersnaam geweigerd worden', function(done){
            var login = {
                username: '', // De juiste gebruikersnaam bij dit wachtwoord is test
                password: 'ad57484016654da87125db86f4227ea3'
            };

            agent
                .post('/login')
                .send(login)
                .set('Content-Type', 'application/json')
                .expect(404)
                .expect('Content-Type', /text\/html/)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.text).to.equal('Wrong username/password');
                    done();
                });
        });


        it('een nog niet geactiveerd account weigeren', function (done) {
            var login = {
                username: 'demo',
                password: 'ad57484016654da87125db86f4227ea3'
            };

            agent
                .post('/login')
                .send(login)
                .set('Content-Type', 'application/json')
                .expect(403)
                .expect('Content-Type', /text\/html/)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.text).to.equal('Not yet activated');
                    done();
                });
        });

        it('een juiste combinatie van gebruikersnaam en wachtwoord geaccepteerd worden', function(done){
            var login = {
                username: 'test',
                password: 'ad57484016654da87125db86f4227ea3'
            };

            agent
                .post('/login')
                .send(login)
                .set('Content-Type', 'application/json')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.body.username).to.equal(login.username);

                    done();
                });

        })
    });