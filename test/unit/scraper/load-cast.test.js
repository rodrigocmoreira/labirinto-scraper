const axios = require('axios');
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
    sandbox = sinon.createSandbox();
    sandbox.spy(winston, 'error');
    sandbox.spy(winston, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should receive a error during the load cast action', async () => {
    const errorOnRequest = {
      message: 'error on request'
    };

    sandbox.stub(axios, 'get')
      .rejects(errorOnRequest);

    const shows = [
      {
        id: 1
      }
    ];

    try {
      await loadCast(shows);
    } catch (error) {
      assert.isNotNull(error);
      assert.strictEqual(error.message, errorOnRequest.message);
      sinon.assert.calledOnce(axios.get);
      sinon.assert.calledTwice(winston.error);
    }
  });

  it('Should receive a request status 429 and then return empty response', async () => {
    const requestStatus429 = {
      status: 429
    };

    const requestStub = sandbox.stub(axios, 'get');

    requestStub.onCall(0).resolves(requestStatus429);
    requestStub.onCall(1).resolves({});

    const shows = [
      {
        id: 1
      }
    ];

    const result = await loadCast(shows);
    assert.deepEqual(result, shows);
    sinon.assert.calledTwice(axios.get);
    sinon.assert.calledOnce(winston.info);
  });
});
