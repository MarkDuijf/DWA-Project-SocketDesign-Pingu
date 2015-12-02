/**
 * Created by sebastiaan on 27-11-2015.
 */
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

   describe('Als een gebruiker wil registreren moet', function(){

       it('een fout e-mailadres geweigerd worden', function(done){
           var register = {
               username: 'SebastiaanVonk',
               password: 'testtest',
               email: 'asdfg',
               firstname: 'Sebastiaan',
               lastname: 'Vonk',
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
                   expect(res.text).to.equal('Error registering, missing data');
                   done();
               });
       });
   });