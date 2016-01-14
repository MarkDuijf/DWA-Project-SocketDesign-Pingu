var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');
var app = require('../app');
require('angular-mocks');
var agent = supertest.agent(app);

describe('basic test', function(){
beforeEach(angular.mock.module('app'));
	it('should show some text', inject(function($controller){
		var scope = {};
		ctrl = $controller('generatorController', {$scope:scope});
		expect(scope.a.length).toBe(3);
	}));
});