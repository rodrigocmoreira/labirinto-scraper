const async = require('async');
const winston = require('winston');
const serviceShows = require('./load-shows');
const serviceCast = require('./load-cast');
const serviceSaveShows = require('./save-shows');

const scraperCore = (() => {
  const showsCrawler = (page, callback) => {
    async.waterfall(
      [
        async.apply(serviceShows.loadShows, page),
        serviceCast.loadCast,
        serviceSaveShows.saveAll
      ],
      (err, shows) => {
        if (err) {
          winston.error('Error on core scraper execution.', err.message);
          return callback(err);
        }
        winston.info('Shows and cast loaded');
        return callback(null, shows);
      }
    );
  };

  const scraperExecution = async () => {
    let scraping = true;
    let page = 0;
    async.whilst(
      () => scraping,
      (next) => {
        showsCrawler(page, (err, result) => {
          if (err) {
            winston.error('Error on core scraper execution.', err.message);
            scraping = false;
            next(err);
          } else if (result && result.length === 0) {
            winston.info('No more pages available to load');
            scraping = false;
            next();
          } else {
            page += 1;
            next();
          }
        });
      },
      (err) => {
        throw err;
      }
    );
  };

  return {
    scraperExecution
  };
})();

module.exports = scraperCore;
