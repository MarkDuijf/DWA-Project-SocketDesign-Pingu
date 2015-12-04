var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
//var User = require('../clientside/models/user');



    describe('Als een gebruiker wil inloggen moet', function () {
        it('een fout wachtwoord geweigerd worden', function (done) {
            var login = {
                username: 'test',
                password: '123'
            };

            agent
                .post('/login')
                .send(login)
                .set('Content-Type', 'application/json')
                .expect(401)
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
                password: 'demo'
            };

            agent
                .post('/login')
                .send(login)
                .set('Content-Type', 'application/json')
                .expect(401)
                .expect('Content-Type', /text\/html/)
                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res.text).to.equal('Not yet activated');
                    done();
                });
        });
    });