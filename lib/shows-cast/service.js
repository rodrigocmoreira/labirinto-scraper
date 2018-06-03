
const async = require('async');
const winston = require('winston');
const { mongoService } = require('../repository');
const findShows = require('./find-shows');

const service = (() => {
  const findShowsWithCast = ((page, callback) => {
    async.waterfall([
      async.apply(mongoService.getMongoInstance),
      async.apply(findShows.withCast, page)
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
    findShowsWithCast
  };
})();

module.exports = service;
