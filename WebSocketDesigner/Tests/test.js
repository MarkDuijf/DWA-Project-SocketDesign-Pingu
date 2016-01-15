var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
require('angular-mocks');
var agent = supertest.agent(app);

describe('basic test', function(){
beforeEach(angular.mock.module('app'));
	it('should show some text', function(){
		expect(app.generatorController).toBeDefined();
});
});