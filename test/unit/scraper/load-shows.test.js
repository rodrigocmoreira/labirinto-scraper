const axios = require('axios');
const sinon = require('sinon');
const winston = require('winston');
const { assert } = require('chai');
const { loadShows } = require('../../../lib/scraper/load-shows');
const { config } = require('../../../lib/commons');

const PENALTY_TIME = 1;
config.set('PENALTY_TIME', PENALTY_TIME);

describe('Unit Test load-shows', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.spy(winston, 'error');
    sandbox.spy(winston, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('Should receive a request status 429 and then return empty response', async () => {
    const requestStatus429 = {
      status: 429
    };

    const requestStub = sandbox.stub(axios, 'get');

    requestStub.onCall(0).resolves(requestStatus429);
    requestStub.onCall(1).resolves({});

    const page = 0;

    const result = await loadShows(page);
    assert.deepEqual(result, []);
    sinon.assert.calledTwice(axios.get);
    sinon.assert.calledOnce(winston.info);
  });
});
