var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);


    describe('If a user wants to login', function () {
        it('a wrong password must be declined', function (done) {
            var login = {
                username: 'test',
                password: 'ad57484016654da87125db86f4227ea' // The right password is ad57484016654da87125db86f4227ea3
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

        it('an empty password must be declined', function(done) {
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

        it('a wrong username must be declined', function(done){
            var login = {
                username: 'testest', // The right username is test
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

        it('an empty username must be declined', function(done){
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


        it('an account which has not been activated yet must be declined ', function (done) {
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

        it('a right combination of username and password must be accepted', function(done){
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