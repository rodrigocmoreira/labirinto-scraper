const RepositoryInstance = require('./instance');

let RepoDB;

const dbService = (() => {
  const getDBInstance = async (db) => {
    if (RepoDB) {
      return RepoDB;
    }
    RepoDB = new RepositoryInstance(db);
    return RepoDB;
  };

  return {
    getDBInstance
  };
})();

module.exports = dbService;
