/**
 * Created by sebastiaan on 11-12-2015.
 */
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);


describe("Als ik op de generate button klik", function(){

    beforeEach(module('theApp'));
    it("moeten verkeerde YAML tags geweigerd worden", function(done){
        var generateController = require('../clientside/assets/js/controllers/generatorController');
        var generate = {
            input: "hoi"
        };

        agent
            .expect(Generate()).toThrow(new Error("The used tag \'' + basePaths[base] + '\' is not used in our syntax. Please remove it"));

    });
});
