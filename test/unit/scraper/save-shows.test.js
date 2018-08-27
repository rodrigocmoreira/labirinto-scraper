// const sinon = require('sinon');
// const winston = require('winston');
// const { assert } = require('chai');
// const { dbService } = require('../../../lib/repository');
// const { saveAll } = require('../../../lib/scraper/save-shows');

// describe('Unit Test save-shows', () => {
//   let sandbox;

//   beforeEach(() => {
//     sandbox = sinon.sandbox.create();
//     sandbox.spy(winston, 'error');
//     sandbox.spy(winston, 'info');
//   });

//   afterEach(() => {
//     sandbox.restore();
//   });

//   it('Should receive an error on db AddMany', (done) => {
//     const errorOnAddMany = {
//       message: 'error adding many'
//     };

//     const mongoFakeObject = {
//       addMany: (shows, callback) => callback(errorOnAddMany)
//     };

//     sandbox.stub(dbService, 'getDBInstance')
//       .yields(null, mongoFakeObject, {});

//     const shows = [{
//       id: 1
//     }];

//     saveAll(shows, (err, result) => {
//       assert.deepEqual(err.message, errorOnAddMany.message);
//       assert.deepEqual(result, shows);
//       sinon.assert.calledOnce(dbService.getDBInstance);
//       sinon.assert.calledOnce(winston.error);
//       done();
//     });
//   });
// });
