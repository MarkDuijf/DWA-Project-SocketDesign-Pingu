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
    it("dan wordt er een zipje gedownload", function(done){

        var dir = {
            dir: '123dirtest'
        };

        agent
            .post('/downloadTest')
            .send(dir)
            .set('Content-Type', 'application/json')
            .expect(404)
            .end(function(err,res) {
                expect(err).to.be.null;
                //expect(res.text).to.equal("Error registering, missing/wrong data");
                done();
            });
    });
});

//As a user I want to receive converted code as a ZIP file so that I can use it in my own project.

describe("als ik geen zip ontvang terwijl dat wel zou moeten",function(){
    xit("dan moet ik een error ontvangen",function(done){

    });
});