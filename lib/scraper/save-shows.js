const winston = require('winston');
const { dbService } = require('../repository');

const saveShows = (() => {
  const saveAll = (shows, callback) => {
    if (shows.length === 0) {
      callback(null, shows);
    } else {
      dbService.getDBInstance((errInstance, db) =>
        db.addMany(shows, (err) => {
          if (err) {
            winston.error('Error saving shows scraped.', err.message);
          } else {
            winston.info(`${shows.length} shows saved: `, JSON.stringify(shows));
          }
          callback(err, shows);
        }));
    }
  };

  return {
    saveAll
  };
})();

module.exports = saveShows;
