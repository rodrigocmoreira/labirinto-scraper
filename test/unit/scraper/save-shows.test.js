const sinon = require('sinon');
const winston = require('winston');
const { assert } = require('chai');
const { mongoService } = require('../../../lib/repository');
const { saveAll } = require('../../../lib/scraper/save-shows');

describe('Unit Test save-shows', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.spy(winston, 'error');
    sandbox.spy(winston, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should receive an error on mongo AddMany', (done) => {
    const errorOnAddMany = {
      message: 'error adding many'
    };

    const mongoFakeObject = {
      addMany: (shows, collectionName, callback) => callback(errorOnAddMany)
    };

    sandbox.stub(mongoService, 'getMongoInstance')
      .yields(null, mongoFakeObject, {});

    const shows = [{
      id: 1
    }];

    saveAll(shows, (err, result) => {
      assert.deepEqual(err.message, errorOnAddMany.message);
      assert.deepEqual(result, shows);
      sinon.assert.calledOnce(mongoService.getMongoInstance);
      sinon.assert.calledOnce(winston.error);
      done();
    });
  });
});
