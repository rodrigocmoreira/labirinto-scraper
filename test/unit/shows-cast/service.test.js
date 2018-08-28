const sinon = require('sinon');
const winston = require('winston');
const { assert } = require('chai');
const { findWithCast } = require('../../../lib/shows-cast/service');
const { dbService } = require('../../../lib/repository');
const find = require('../../../lib/shows-cast/find-shows');

describe('Unit Test show-cast Service', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.spy(winston, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#service execution - Error cases', () => {
    it('Should receive a error during the service execution', async () => {
      const errorOnWithCast = {
        message: 'error on with Cast'
      };

      const dbFakeObject = {};

      sandbox.stub(dbService, 'getDBInstance')
        .resolves(dbFakeObject);

      sandbox.stub(find, 'withCast')
        .rejects(errorOnWithCast);

      const page = 0;

      try {
        await findWithCast(page);
      } catch (error) {
        assert.isNotNull(error);
        sinon.assert.calledOnce(dbService.getDBInstance);
        sinon.assert.calledOnce(find.withCast);
        sinon.assert.calledOnce(winston.error);
      }
    });
  });
});
