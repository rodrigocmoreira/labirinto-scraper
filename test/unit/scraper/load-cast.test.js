const request = require('request');
const sinon = require('sinon');
const winston = require('winston');
const { assert } = require('chai');
const { loadCast } = require('../../../lib/scraper/load-cast');
const { config } = require('../../../lib/commons');

const PENALTY_TIME = 1;

config.set('PENALTY_TIME', PENALTY_TIME);

describe('Unit Test load-cast', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.spy(winston, 'error');
    sandbox.spy(winston, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should receive a error during the load cast action', (done) => {
    const errorOnRequest = {
      message: 'error on request'
    };

    sandbox.stub(request, 'get')
      .yields(errorOnRequest, null, {});

    const shows = [
      {
        id: 1
      }
    ];

    loadCast(shows, (err) => {
      assert.isNotNull(err);
      assert.strictEqual(err.message, errorOnRequest.message);
      sinon.assert.calledOnce(request.get);
      sinon.assert.calledTwice(winston.error);
      done();
    });
  });

  it('Should receive a request status 429 and then return empty response', (done) => {
    const requestStatus429 = {
      statusCode: 429
    };

    const requestStub = sandbox.stub(request, 'get');

    requestStub.onCall(0).yields(null, requestStatus429, {});
    requestStub.onCall(1).yields(null, null, {});

    const shows = [
      {
        id: 1
      }
    ];

    loadCast(shows, (err, result) => {
      assert.isNull(err);
      assert.deepEqual(result, shows);
      sinon.assert.calledTwice(request.get);
      sinon.assert.calledOnce(winston.info);
      done();
    });
  });
});
