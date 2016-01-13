/**
 * Created by sebastiaan on 11-12-2015.
 */
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var angular = require('../clientside/assets/js/angular.min');
//var main = require('../clientside/assets/js/controllers/main');
//var angular1 = require('../clientside/assets/js/angular-file-saver.bundle.min');
//var angular2 = require('../clientside/assets/js/angular-route.min');
//var angular3 = require('../clientside/assets/js/bootstrap.min');
//var angular4 = require('../clientside/assets/js/esprima');
//var angular5 = require('../clientside/assets/js/jquery.min');
//var angular6 = require('../clientside/assets/js/jquery.poptrox.min');
//var angular7 = require('../clientside/assets/js/jquery.scrollex.min');
//var angular8 = require('../clientside/assets/js/jquery.scrolly.min');
//var angular9 = require('../clientside/assets/js/js-yaml');
//var angular10 = require('../clientside/assets/js/main');
//var angular11 = require('../clientside/assets/js/skel.min');
//var angular12= require('../clientside/assets/js/socket.io-1.3.7');
//var angular13 = require('../clientside/assets/js/util');

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
