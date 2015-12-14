/**
 * Created by sebastiaan on 14-12-2015.
 */
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../../app');
var agent = supertest.agent(app);

// As a user I want to be able to save the YAML code I put in the generator so that I can see my previous projects.

describe("als ik code wil opslaan en ik klik op de \"save\" knop", function(){

    xit("dan moet goede code zonder problemen opgeslagen worden",function(done){

    });

    xit("dan moet ik een melding ontvangen of ik het zeker weet, wanneer de code fouten bevat", function(done){

    });
});