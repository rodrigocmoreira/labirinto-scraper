
const winston = require('winston');
const { dbService } = require('../repository');
const find = require('./find-shows');

const service = (() => {
  const findWithCast = (async (page) => {
    try {
      const db = await dbService.getDBInstance();
      const result = await find.withCast(page, db);
      winston.info('find-shows executed successfully');
      return Promise.resolve(result);
    } catch (error) {
      winston.error('Error on find-shows: %s', error.message);
      return Promise.reject(error);
    }
  });

  return {
    findWithCast
  };
})();

module.exports = service;
