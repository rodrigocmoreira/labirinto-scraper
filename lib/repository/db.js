const Datastore = require('nedb');
const RepositoryInstance = require('./instance');

let RepoDB;

const dbService = (() => {
  const getDBInstance = (callback) => {
    if (RepoDB) {
      callback(null, RepoDB);
    } else {
      const db = new Datastore();
      db.ensureIndex({ fieldName: 'id', unique: true }, (err) => {
        RepoDB = new RepositoryInstance(db);
        callback(err, RepoDB);
      });
    }
  };

  return {
    getDBInstance
  };
})();

module.exports = dbService;
