const request = require('request');
const winston = require('winston');
const mapper = require('object-mapper');
const { config } = require('../commons/');

const radix = 10;
const timeoutPenalty = parseInt(config.get('PENALTY_TIME'), radix);

const service = (() => {
  const loadShows = (page, callback) => {
    const options = {
      url: `${config.get('TVMAZE_SHOWS_URL')}?page=${page}`,
      json: true
    };

    request.get(options, (err, response) => {
      let error;
      if (err) {
        error = err;
        winston.error('Request Error %s %s - ', options.method, options.url, err.message);
        return callback(err);
      }
      if (response && response.statusCode === 429) {
        winston.info('Limit Reached %s %s - ', options.method, options.url, response.statusCode);
        return setTimeout(() => loadShows(page, callback), timeoutPenalty);
      }

      winston.info(`Shows Get for page ${page} done!`);

      const transformMapper = {
        '[].id': '[].id',
        '[].name': '[].name'
      };

      const filteredBody = mapper(response.body, [], transformMapper);

      return callback(error, filteredBody);
    });
  };

  return {
    loadShows
  };
})();

module.exports = service;
