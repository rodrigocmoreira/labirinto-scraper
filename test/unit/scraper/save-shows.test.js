const sinon = require('sinon');
const winston = require('winston');
const { assert } = require('chai');
const { dbService } = require('../../../lib/repository');
const { saveAll } = require('../../../lib/scraper/save-shows');

describe('Unit Test save-shows', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.spy(winston, 'error');
    sandbox.spy(winston, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should receive an error on db AddMany', async () => {
    const errorOnAddMany = {
      message: 'error adding many'
    };

    const mongoFakeObject = {
      addMany: () => Promise.reject(errorOnAddMany)
    };

    sandbox.stub(dbService, 'getDBInstance')
      .resolves(mongoFakeObject);

    const shows = [{
      id: 1
    }];

    try {
      await saveAll(shows);
    } catch (error) {
      assert.deepEqual(error.message, errorOnAddMany.message);
      sinon.assert.calledOnce(dbService.getDBInstance);
      sinon.assert.calledOnce(winston.error);
    }
  });
});
