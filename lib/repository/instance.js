const winston = require('winston');

class RepositoryInstance {
  constructor(repositoryClient) {
    this.repositoryClient = repositoryClient;
  }

  addManyShows(shows, collection, callback) {
    return this.repositoryClient.collection(collection).insertMany(shows, (err, result) => {
      winston.info('inserted:', result);
      return callback(err, result);
    });
  }

  findShows(query, projection, sort, collection, callback) {
    return this.repositoryClient.collection(collection).find(query, projection).sort(sort)
      .toArray((err, shows) => {
        winston.info('found: ', shows);
        return callback(err, shows);
      });
  }
}

module.exports = RepositoryInstance;
