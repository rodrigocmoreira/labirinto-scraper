// const request = require('request');
// const sinon = require('sinon');
// const winston = require('winston');
// const { assert } = require('chai');
// const { loadShows } = require('../../../lib/scraper/load-shows');
// const { config } = require('../../../lib/commons');

// const PENALTY_TIME = 1;
// config.set('PENALTY_TIME', PENALTY_TIME);

// describe('Unit Test load-shows', () => {
//   let sandbox;

//   beforeEach(() => {
//     sandbox = sinon.sandbox.create();
//     sandbox.spy(winston, 'error');
//     sandbox.spy(winston, 'info');
//   });

//   afterEach(() => {
//     sandbox.restore();
//   });

//   it('Should receive a request status 429 and then return empty response', (done) => {
//     const requestStatus429 = {
//       statusCode: 429
//     };

//     const requestStub = sandbox.stub(request, 'get');

//     requestStub.onCall(0).yields(null, requestStatus429, {});
//     requestStub.onCall(1).yields(null, null, {});

//     const page = 0;

//     loadShows(page, (err, result) => {
//       assert.isNull(err);
//       assert.deepEqual(result, []);
//       sinon.assert.calledTwice(request.get);
//       sinon.assert.calledOnce(winston.info);
//       done();
//     });
//   });
// });
