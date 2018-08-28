const supertest = require('supertest');
const Datastore = require('nedb');
const { assert } = require('chai');
const { dbService } = require('../../../lib/repository');
const server = require('../../../lib/application');

let app;

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
        birthday: new Date('1950-01-01')
      }
    ]
  },
  {
    id: 5,
    name: 'The OA',
    cast: [
      {
        id: 8,
        name: 'Michael Jordan',
        birthday: new Date('1984-01-01')
      },
      {
        id: 9,
        name: 'Cristiano Ronaldo'
      }
    ]
  },
  {
    id: 6,
    name: 'Stranger Things',
    cast: [
      {
        id: 8,
        name: 'The Thing'
      },
      {
        id: 9,
        name: 'Jordan Pele',
        birthday: new Date('1979-01-01')
      }
    ]
  }
];

describe('Integration test shows-cast', () => {
  describe('# /showsCast/ route', () => {
    before(async () => {
      app = await server.start();
      const db = await dbService.getDBInstance(new Datastore());
      db.clean();
      await db.addMany(shows);
    });

    after(async () => {
      await server.close();
    });

    it('Should return 200 and a list of shows and Cast', async () => {
      const expectedBodyResult = [
        {
          id: 1,
          name: 'Game of Thrones',
          cast: [
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
        },
        {
          id: 4,
          name: 'Big Bang Theory',
          cast: [
            {
              id: 6,
              name: 'Michael Emerson',
              birthday: '1950-01-01'
            }
          ]
        },
        {
          id: 5,
          name: 'The OA',
          cast: [
            {
              id: 8,
              name: 'Michael Jordan',
              birthday: '1984-01-01'
            },
            {
              id: 9,
              name: 'Cristiano Ronaldo'
            }
          ]
        },
        {
          id: 6,
          name: 'Stranger Things',
          cast: [
            {
              id: 9,
              name: 'Jordan Pele',
              birthday: '1979-01-01'
            },
            {
              id: 8,
              name: 'The Thing'
            }
          ]
        }
      ];

      const response = await supertest(app).get('/showsCast/');
      assert.equal(200, response.statusCode);
      assert.deepEqual(response.body, expectedBodyResult);
    });
  });
});
