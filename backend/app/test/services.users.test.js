const assert = require('assert');
const proxyquire = require('proxyquire');

const { MongoLibMock, getAllStub } = require('../utils/mocks/mongoLib');

const { usersMock } = require('../utils/mocks/users');

describe('services - users', function(){
    const UserServices = proxyquire('../services/users',{
        '../lib/mongo': MongoLibMock
    })

    const usersService = new UserServices();

    describe('when getUsers method is called', async function(){
        it('should call the getall MongoLib method', async function(){
            await usersService.getUsers({});
            assert.strictEqual(getAllStub.called, true);
        });

        it('should return an array of users', async function() {
            const result = await usersService.getUsers({});
            const expected = usersMock;
            assert.deepEqual(result, expected);
          });
    });
})