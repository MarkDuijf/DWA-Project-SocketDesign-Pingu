/**
 * Created by sebastiaan on 26-11-2015.
 */
"use strict";

var mongoose = require('mongoose');
var chai = require('chai');

var expect = chai.expect;

var Project = require('../project');

var testDbName = 'testDatabase';

describe("project", function () {

    before(function (done) {
        if (mongoose.connection.readyState === 0) {
            mongoose.connect('mongodb://localhost/' + testDbName, done);
        }
    });

    beforeEach(function (done) {
        mongoose.connection.db.dropDatabase(done);
    });


    describe('test', function () {
        it('should create a project', function (done) {
            var p = new Project({
                username: "SebastiaanVonk",
                code: "Dit is allemaal code",
                date: "2015-26-11"
            });

            p.save(function (err) {
                expect(err).to.be.null;

                Project.findOne({}, function (err, product) {
                    expect(project._id).to.exist;
                    expect(project.__v).to.exist;
                    expect(project.username).to.equal("SebastiaanVonk");
                    expect(project.code).to.equal("Dit is allemaal code");
                    expect(project.date).to.equal("2015-26-11");
                    done();
                });
            });
        });
    });
});