/**
 * Created by sebastiaan on 27-11-2015.
 */
var mongoose = require('mongoose');
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var testDbName = 'socketDesignerDB';

mongoose.connect('mongodb://localhost/' + testDbName, function(){
   describe('Als een gebruiker wil registreren moet', function(){

       it('een fout e-mailadres geweigerd worden', function(done){
           var registreer = {
               email: 'asdfg'
           };

           agent
               .post('/register')
               .send(register)
               .set('Content-Type', 'application/json')
               .expect(200)
               .expect('Content-Type', /text\/html/)
               .end(function(err,res) {
                   expect(err).to.be.null;
                   expect(res.text).to.equal('Invalid e-mail');
                   done();
               });
       });
   });
});
