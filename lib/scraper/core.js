const winston = require('winston');
const pWhilst = require('p-whilst');
const serviceShows = require('./load-shows');
const serviceCast = require('./load-cast');
const serviceSaveShows = require('./save-shows');

const scraperCore = (() => {
  const showsCrawler = async (page) => {
    try {
      let shows = await serviceShows.loadShows(page);
      shows = await serviceCast.loadCast(shows);
      await serviceSaveShows.saveAll(shows);
      winston.info('Shows and cast loaded');
      return Promise.resolve(shows);
    } catch (error) {
      winston.error('Error on core scraper execution.', error.message);
      return Promise.reject(error);
    }
  };

  const scraperExecution = async () => {
    let scraping = true;
    let page = 0;
    try {
      await pWhilst(() => scraping,
        async () => {
          const result = await showsCrawler(page);
          if (result && result.length === 0) {
            winston.info('No more pages available to load');
            scraping = false;
          } else {
            page += 1;
          }
        });
      return Promise.resolve();
    } catch (error) {
      winston.error(`Error on core scraper execution. ${error.message}`);
      scraping = false;
      return Promise.reject(error);
    }
  };

  return {
    scraperExecution
  };
})();

module.exports = scraperCore;
