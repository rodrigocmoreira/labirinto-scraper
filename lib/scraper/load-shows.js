const axios = require('axios');
const winston = require('winston');
const mapper = require('object-mapper');
const { config } = require('../commons/');

const service = (() => {
  const loadShows = async (page) => {
    const url = `${config.get('TVMAZE_SHOWS_URL')}?page=${page}`;

    try {
      const response = await axios.get(url);
      if (response) {
        if (response.status === 429) {
          winston.info(`Limit Reached on Load Shows - ${url} - ${response.status}`);
          return new Promise((resolve) => {
            setTimeout(() => resolve(loadShows(page)),
              config.get('PENALTY_TIME'));
          });
        }
        if (response.status === 200) {
          winston.info(`Shows Get for page ${page} done!`);

          const transformMapper = {
            '[].id': '[].id',
            '[].name': '[].name'
          };

          const filteredBody = mapper(response.data, [], transformMapper);

          return Promise.resolve(filteredBody);
        }
      }
      const noShowsResponse = [];
      return Promise.resolve(noShowsResponse);
    } catch (error) {
      winston.error(`Request Error ${url} - ${error.message}`);
      return Promise.reject(error);
    }
  };

  return {
    loadShows
  };
})();

module.exports = service;
