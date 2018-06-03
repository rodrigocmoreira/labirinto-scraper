const async = require('async');
const winston = require('winston');
const service = require('./load-shows');

const scraperCore = (() => {
  const scraperExecution = (page) => {
    async.waterfall(
      [
        async.apply(service.loadShows, page)
      ],
      (err, result) => {
        if (err) {
          winston.error('Error on core scraper execution.', err);
        }

        if (result.length === 0) {
          winston.info('No more pages available to load');
        } else {
          scraperExecution(page + 1);
        }
      }
    );
  };

  return {
    scraperExecution
  };
})();

module.exports = scraperCore;
