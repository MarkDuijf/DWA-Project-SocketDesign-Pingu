/**
 * Created by sebastiaan on 14-12-2015.
 */
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../../app');
var agent = supertest.agent(app);

// As a user I want to put YAML code in the editor so that I can send it towards the generator.

describe("Als ik code heb ingevoerd", function(){
    xit("en ik klik op de \"generate client-side code\" knop, dan wordt de client-side code omgezet",function(done){

    });

    xit("en ik klik op de \"generate server-side code\" knop, dan wordt de server-side code omgezet", function(done){

    });
});

describe("Als ik geen code heb ingevoerd", function(){
    //TODO welke van de 2 opties moeten we hebben?
    xit("en ik klik op de \"generate client-side code\" knop, dan ontvang ik een error", function(done){

    });

    xit("en ik klik op de \"generate server-side code\" knop, dan ontvang ik een error", function(done){

    });

    // of

    xit("dan worden de generate buttons gedisabled", function(done){

    });
});