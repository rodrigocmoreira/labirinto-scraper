const async = require('async');
const supertest = require('supertest');
const { assert } = require('chai');
const { mongoService } = require('../../../lib/repository');
const server = require('../../../lib/application');

let app;

describe('Integration test shows-cast', () => {
  describe('# /showsCast/ route', () => {
    const shows = [
      {
        id: 1,
        name: 'Game of Thrones',
        cast: [
          {
            id: 9,
            name: 'Dean Norris',
            birthday: new Date('1963-04-08')
          },
          {
            id: 7,
            name: 'Mike Vogel',
            birthday: new Date('1979-07-17')
          },
        ]
      },
      {
        id: 4,
        name: 'Big Bang Theory',
        cast: [
          {
            id: 6,
            name: 'Michael Emerson',
            birthday: new Date('1950-01-01')
          },
        ]
      }
    ];

    before((done) => {
      async.series([
        (callback) => {
          server.start((err, express) => {
            app = express;
            callback();
          });
        },
        (callback) => {
          mongoService.getMongoInstance((err, mongo) => {
            mongo.clean('shows', () => {
              mongo.addMany(shows, 'shows', callback);
            });
          });
        }
      ], (err) => {
        done(err);
      });
    });

    after((done) => {
      mongoService.getMongoInstance((err, mongo) => {
        mongo.close(() => server.close(done));
      });
    });

    it('Should return 200 and a list of shows and Cast', (done) => {
      const expectedBodyResult = [
        {
          id: 1,
          name: 'Game of Thrones',
          cast: [
            {
              id: 9,
              name: 'Dean Norris',
              birthday: new Date('1963-04-08').toISOString()
            },
            {
              id: 7,
              name: 'Mike Vogel',
              birthday: new Date('1979-07-17').toISOString()
            }
          ]
        },
        {
          id: 4,
          name: 'Big Bang Theory',
          cast: [
            {
              id: 6,
              name: 'Michael Emerson',
              birthday: new Date('1950-01-01').toISOString()
            }
          ]
        }
      ];

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
