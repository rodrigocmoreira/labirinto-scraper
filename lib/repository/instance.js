const winston = require('winston');

class RepositoryInstance {
  constructor(repositoryClient) {
    this.repositoryClient = repositoryClient;
  }

  addMany(shows, callback) {
    return this.repositoryClient.insert(shows, (err, result) => {
      winston.info('inserted:', result);
      return callback(err, result);
    });
  }

  find(query, projection, sort, callback) {
    return this.repositoryClient.find(query, projection).sort(sort)
      .exec((err, shows) => {
        winston.info('found: ', shows);
        return callback(err, shows);
      });
  }

  async clean() {
    this.repositoryClient.remove({}, { multi: true });
  }
}

module.exports = RepositoryInstance;
