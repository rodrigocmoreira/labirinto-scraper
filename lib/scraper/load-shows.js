const request = require('request');
const winston = require('winston');
const mapper = require('object-mapper');
const { config } = require('../commons/');

const service = (() => {
  const loadShows = (page, callback) => {
    const options = {
      url: `${config.get('TVMAZE_SHOWS_URL')}?page=${page}`,
      json: true
    };

    request.get(options, (err, response) => {
      if (err) {
        winston.error('Request Error %s %s - ', options.method, options.url, err.message);
        callback(err);
      } else if (response) {
        if (response.statusCode === 429) {
          winston.info('Limit Reached on Load Shows - %s', options.method, options.url, response.statusCode);
          setTimeout(() => loadShows(page, callback), config.get('PENALTY_TIME'));
        }
        if (response.statusCode === 200) {
          winston.info(`Shows Get for page ${page} done!`);

          const transformMapper = {
            '[].id': '[].id',
            '[].name': '[].name'
          };

          const filteredBody = mapper(response.body, [], transformMapper);

          callback(err, filteredBody);
        }
      } else {
        const noShowsResponse = [];
        callback(err, noShowsResponse);
      }
    });
  };

  return {
    loadShows
  };
})();

module.exports = service;
