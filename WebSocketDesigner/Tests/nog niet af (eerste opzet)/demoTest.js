/**
 * Created by sebastiaan on 14-12-2015.
 */
var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../../app');
var agent = supertest.agent(app);


//As a user I want to be able to see an example of the YAML and its generated socket.io code so that I can see how the conversion works.

describe("Als ik een demo wil hebben en ik op de download knop klik", function(){
    xit("dan wordt er een zipje gedownload", function(done){

    });
});

//As a user I want to receive converted code as a ZIP file so that I can use it in my own project.

describe("als ik geen zip ontvang terwijl dta wel zou moeten",function(){
    xit("dan moet ik een error ontvangen",function(done){

    });
});