/**
 * Created by sebastiaan on 2-12-2015.
 */
var expect = require('expect');
var userRoutes = require('../app');

describe('user routes', function(){
    describe('index', function(){
        it('returns Succes!', function(){
            userRoutes['/email'].fn({}, {
                json: function(data) {
                    expect(data).to.eql({res: 'Succes!'});
                }
            });
        });
    });
});
