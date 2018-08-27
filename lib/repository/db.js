const RepositoryInstance = require('./instance');

let RepoDB;

const dbService = (() => {
  const getDBInstance = async (db) => {
    if (!RepoDB) {
      RepoDB = new RepositoryInstance(db);
    }

    return Promise.resolve(RepoDB);
  };

  return {
    getDBInstance
  };
})();

module.exports = dbService;
