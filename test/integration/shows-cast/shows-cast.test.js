const ROOT_PATH = process.cwd()
const async = require('async');
const Chance = require('chance');
const chance = new Chance();
const supertest = require('supertest');
const { assert } = require('chai');
const { config } = require(`${ROOT_PATH}/lib/commons`);
const server = require(`${ROOT_PATH}/lib/application`);
const url = require('url');

let app;

describe('Integration test shows-cast', () => {
  describe('# /showsCast/ route', () => {
    before((done) => {
      async.series([
        (callback) => {
          server.start((err, express) => {
            app = express;
            callback();
          });
        }
      ], (err) => {
        done(err);
      });
    });

    after((done) => {
      server.close(done);
    });

    it('Should return 200 and a list of shows and Cast', (done) => {
      const expectedBodyResult = {
        shows: []
      };

      supertest(app)
        .get('/showsCast/')
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(200, res.statusCode);
          assert.deepEqual(res.body, expectedBodyResult);
          done();
        });
    });
  });
});
