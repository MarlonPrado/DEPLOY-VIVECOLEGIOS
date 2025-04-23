const assert = require('assert');
const buildMessage = require('../utils/buildMessage');

describe('utils - buildMessage', function(){
    describe('when receives an entity and an action', function(){
        it('should return the respective message', function(){
            const result =  buildMessage('user', 'create');
            const expect = "user created";
            assert.strictEqual(result,expect);
        });
    });

    describe('when receives an entity and an action and it a list', function(){
        it('should return the respective messafe with the entity in plural', function(){
            const result = buildMessage('user', 'list');
            const expected = 'users listed';
            assert.strictEqual(result, expected);
        });
        
    })
});