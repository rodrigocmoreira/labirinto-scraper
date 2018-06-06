const async = require('async');
const request = require('request');
const winston = require('winston');
const mapper = require('object-mapper');
const { config } = require('../commons/');

const service = (() => {
  const loadCastForShow = (currentShow, callback) => {
    const show = currentShow;

    const options = {
      url: config.get('TVMAZE_CAST_URL').replace(':id', show.id),
      json: true
    };

    request.get(options, (err, response) => {
      if (err) {
        winston.error('Request Error %s - %s', options.url, err.message);
        callback(err);
      } else if (response) {
        if (response.statusCode === 429) {
          winston.info('Limit Reached on Load Cast %s - %s', options.url, response.statusCode);
          setTimeout(() => loadCastForShow(show, callback), config.get('PENALTY_TIME'));
        }
        if (response.statusCode === 200) {
          winston.info(`Cast GET for show ${show.name} done!`);

          const transformMapper = {
            '[].person.id': '[].id',
            '[].person.name': '[].name',
            '[].person.birthday': '[].birthday'
          };

          show.cast = mapper(response.body, [], transformMapper);

          callback(err, show);
        }
      } else {
        const noResponseCast = {};
        show.cast = noResponseCast;
        callback(err, response);
      }
    });
  };

  const loadCast = (shows, done) => {
    if (shows.length === 0) {
      done(null, shows);
    } else {
      async.each(
        shows,
        (show, callback) => loadCastForShow(show, (err) => {
          callback(err);
        }),
        (err) => {
          if (err) {
            winston.error('Error on load cast - %s', err.message);
            done(err);
          } else {
            done(err, shows);
          }
        }
      );
    }
  };

  return {
    loadCast
  };
})();

module.exports = service;
