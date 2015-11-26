/**
 * Created by sebastiaan on 26-11-2015.
 */
"use strict";

var mongoose = require('mongoose');
var chai = require('chai');

var expect = chai.expect;

var User = require('../user');

var testDbName = 'testDatabase';

describe("user", function () {

    before(function (done) {
        if (mongoose.connection.readyState === 0) {
            mongoose.connect('mongodb://localhost/' + testDbName, done);
        }
    });

    beforeEach(function (done) {
        mongoose.connection.db.dropDatabase(done);
    });


    describe('test', function () {
        it('should create an user', function (done) {
            var u = new User({
                username: "SebastiaanVonk",
                password: "testtest",
                email: "LHA.Vonk@student.han.nl",
                firstname: "Sebastiaan",
                lastname: "Vonk"
            });

            u.save(function (err) {
                expect(err).to.be.null;

                User.findOne({}, function (err, user) {
                    expect(user._id).to.exist;
                    expect(user.__v).to.exist;
                    expect(user.username).to.equal("SebastiaanVonk");
                    expect(user.password).to.equal("testtest");
                    expect(user.email).to.equal("LHA.Vonk@student.han.nl");
                    expect(user.firstname).to.equal("Sebastiaan");
                    expect(user.lastname).to.equal("Vonk");
                    console.log(user);
                    done();
                });
            });
        });
    });
});