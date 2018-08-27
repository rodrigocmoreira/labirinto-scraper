const axios = require('axios');
const pEachSeries = require('p-each-series');
const winston = require('winston');
const mapper = require('object-mapper');
const { config } = require('../commons/');

const service = (() => {
  const loadCastForShow = async (currentShow) => {
    const show = currentShow;
    const url = config.get('TVMAZE_CAST_URL').replace(':id', show.id);
    try {
      const response = await axios.get(url);
      if (response) {
        if (response.status === 429) {
          winston.info('Limit Reached on Load Cast %s - %s', url, response.statusCode);
          return new Promise((resolve) => {
            setTimeout(() => resolve(loadCastForShow(show)),
              config.get('PENALTY_TIME'));
          });
        }
        if (response.status === 200) {
          winston.info(`Cast GET for show ${show.name} done!`);

          const transformMapper = {
            '[].person.id': '[].id',
            '[].person.name': '[].name',
            '[].person.birthday': '[].birthday'
          };

          show.cast = mapper(response.body, [], transformMapper);
        }
      }
      if (!show.cast) {
        const noResponseCast = {};
        show.cast = noResponseCast;
      }
      return Promise.resolve(show);
    } catch (error) {
      winston.error('Request Error %s - %s', url, error.message);
      return Promise.reject(error);
    }
  };

  const loadCast = async (shows) => {
    try {
      if (shows.length > 0) {
        await pEachSeries(shows, async show => loadCastForShow(show));
      }
      return Promise.resolve(shows);
    } catch (error) {
      winston.error('Error on load cast - %s', error.message);
      return Promise.reject(error);
    }
  };

  return {
    loadCast
  };
})();

module.exports = service;
