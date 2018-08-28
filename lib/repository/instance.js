const winston = require('winston');

class RepositoryInstance {
  constructor(repositoryClient) {
    this.repositoryClient = repositoryClient;
  }

  addMany(shows) {
    return new Promise((resolve, reject) => {
      this.repositoryClient.insert(shows, (err, result) => {
        if (err) {
          return reject(err);
        }
        winston.info('inserted:', result);
        return resolve(result);
      });
    });
  }

  find(query, projection, sort) {
    return new Promise((resolve, reject) => {
      this.repositoryClient.find(query, projection).sort(sort)
        .exec((err, shows) => {
          if (err) {
            return reject(err);
          }
          winston.info('found: ', shows);
          return resolve(shows);
        });
    });
  }

  clean() {
    this.repositoryClient.remove({}, { multi: true });
  }
}

module.exports = RepositoryInstance;
