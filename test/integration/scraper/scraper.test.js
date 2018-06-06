const nock = require('nock');
const { assert } = require('chai');
const { dbService } = require('../../../lib/repository');
const { config } = require('../../../lib/commons');
const server = require('../../../lib/application');
const { core } = require('../../../lib/scraper');

const TVMAZE_SHOWS_URL = 'http://shows.com/shows';
const TVMAZE_CAST_URL = 'http://cast.com/shows/:id/cast';

config.set('TVMAZE_SHOWS_URL', TVMAZE_SHOWS_URL);
config.set('TVMAZE_CAST_URL', TVMAZE_CAST_URL);
config.set('PAGE_SIZE', 1);

describe('#Integration scraper loader  test scraper', () => {
  before((done) => {
    server.start(() => {
      dbService.getDBInstance((err, db) => {
        db.clean(done);
      });
    });
  });

  beforeEach((done) => {
    nock.cleanAll();
    done();
  });

  after((done) => {
    nock.cleanAll();
    server.close(done);
  });

  it('Should fill database with loaded shows with cast', (done) => {
    const showsBodyResultPage0 = [
      {
        id: 1,
        name: 'Game of Thrones',
        channel: 'hbo'
      }
    ];

    const showsBodyResultPage1 = [
      {
        id: 2,
        name: 'Big Bang Theory',
        channel: 'warner'
      }
    ];

    const showsBodyResultPage2 = [];

    const castResult1 = [
      {
        id: 1,
        name: 'Game of Thrones',
        person: [
          {
            id: 9,
            name: 'Dean Norris',
            birthday: '1963-04-08'
          },
          {
            id: 7,
            name: 'Mike Vogel',
            birthday: '1979-07-17'
          }
        ]
      }
    ];

    const castResult2 = [
      {
        id: 2,
        name: 'Big Bang Theory',
        person: [
          {
            id: 6,
            name: 'Michael Emerson',
            birthday: '1950-01-01'
          }
        ]
      }
    ];

    const nockShows = nock('http://shows.com/shows');

    const showsNockGetPage0 = () =>
      nockShows
        .get('?page=0')
        .reply(200, () => showsBodyResultPage0);

    const showsNockGetPage1 = () =>
      nockShows
        .get('?page=1')
        .reply(200, () => showsBodyResultPage1);

    const showsNockGetPage2 = () =>
      nockShows
        .get('?page=2')
        .reply(200, () => showsBodyResultPage2);

    const nockCast = nock('http://cast.com/shows');

    const showsNockGetCastId1 = () =>
      nockCast
        .get('/1/cast')
        .reply(200, () => castResult1);

    const showsNockGetCastId2 = () =>
      nockCast
        .get('/2/cast')
        .reply(200, () => castResult2);

    showsNockGetPage0();
    showsNockGetPage1();
    showsNockGetPage2();
    showsNockGetCastId1();
    showsNockGetCastId2();

    const expectedResult = [
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
          }
        ]
      },
      {
        id: 2,
        name: 'Big Bang Theory',
        cast: [
          {
            id: 6,
            name: 'Michael Emerson',
            birthday: new Date('1950-01-01')
          }
        ]
      }
    ];

    core.scraperExecution((err) => {
      assert.isNull(err);
      dbService.getDBInstance((errInstance, db) => {
        db.find({}, { _id: 0 }, { id: 1 }, (errFind, shows) => {
          assert.deepEqual(shows, expectedResult);
          done();
        });
      });
    });
  });

  it('Should return error on get shows', (done) => {
    const showsNockGetPage0 = () => {
      const urlShows = `${config.get('TVMAZE_SHOWS_URL')}`;
      return nock(urlShows)
        .get('?page=0', () => true)
        .replyWithError(500, {});
    };

    showsNockGetPage0();

    core.scraperExecution((err) => {
      assert.isNotNull(err);
      done();
    });
  });
});
