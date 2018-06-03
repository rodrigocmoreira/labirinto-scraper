const mongodb = require('mongo-mock');
const RepositoryInstance = require('./instance');
const config = require('../../lib/commons/conf');

const mongoUrl = config.get('MONGO_URL');

let RepoMongoMock;

const mongoService = (() => {
  const connectToMongo = (mongoClient, callback) => {
    mongoClient.connect(mongoUrl, {}, (err, db) => {
      RepoMongoMock = new RepositoryInstance(db);
      return callback(null, RepoMongoMock);
    });
  };

  const getMongoInstance = (callback) => {
    if (RepoMongoMock) {
      return callback(null, RepoMongoMock);
    }

    mongodb.max_delay = 20;
    const mongoClient = mongodb.MongoClient;
    mongoClient.persist = 'mongo-mock.js';

    return connectToMongo(mongoClient, callback);
  };

  return {
    getMongoInstance
  };
})();

module.exports = mongoService;
