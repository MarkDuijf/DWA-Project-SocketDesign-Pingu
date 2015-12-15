/**
 * Created by sebastiaan on 14-12-2015.
 */
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../../app');
var agent = supertest.agent(app);

//As the server I must be able to convert the inputted code to server and client side socket.io code so that I can send it back to the user

describe("Als de code opgestuurd is", function(){
    xit("moet goede code door de validatie komen", function(done){

    });

    xit("moet er een error teruggestuurd worden als de code niet valideerd", function(done){

    });
});

