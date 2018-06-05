const sinon = require('sinon');
const { assert } = require('chai');
const { findWithCast } = require('../../../lib/shows-cast/service');
const { mongoService } = require('../../../lib/repository');
const find = require('../../../lib/shows-cast/find-shows');
const winston = require('winston');

describe('Unit Test show-cast Service', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.spy(winston, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#service execution - Error cases', () => {
    it('Should receive a error during the service execution', (done) => {
      sandbox.stub(mongoService, 'getMongoInstance')
        .yields(null, {}, {});

      sandbox.stub(find, 'withCast')
        .yields({}, null, {});

      const page = 0;

      findWithCast(page, (err) => {
        assert.isNotNull(err);
        sinon.assert.calledOnce(mongoService.getMongoInstance);
        sinon.assert.calledOnce(find.withCast);
        sinon.assert.calledOnce(winston.error);
        done();
      });
    });
  });
});
