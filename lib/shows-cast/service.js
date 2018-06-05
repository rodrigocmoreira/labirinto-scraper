
const async = require('async');
const winston = require('winston');
const { mongoService } = require('../repository');
const find = require('./find-shows');

const service = (() => {
  const findWithCast = ((page, callback) => {
    async.waterfall([
      async.apply(mongoService.getMongoInstance),
      async.apply(find.withCast, page)
    ], (err, res) => {
      if (err) {
        winston.error('Error on find-shows: %s', err.message);
      } else {
        winston.info('find-shows executed successfully');
      }
      return callback(err, res);
    });
  });

  return {
    findWithCast
  };
})();

module.exports = service;
