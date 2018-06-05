const winston = require('winston');

class RepositoryInstance {
  constructor(repositoryClient) {
    this.repositoryClient = repositoryClient;
    this.repositoryClient.collection('shows').drop(() => {});
  }

  addMany(shows, collection, callback) {
    return this.repositoryClient.collection(collection).insertMany(shows, (err, result) => {
      winston.info('inserted:', result);
      return callback(err, result);
    });
  }

  find(query, projection, sort, collection, callback) {
    return this.repositoryClient.collection(collection).find(query, projection).sort(sort)
      .toArray((err, shows) => {
        winston.info('found: ', shows);
        return callback(err, shows);
      });
  }

  clean(collection, callback) {
    this.repositoryClient.collection(collection).drop(() => callback());
  }

  close(callback) {
    this.repositoryClient.close();
    return callback();
  }
}

module.exports = RepositoryInstance;
