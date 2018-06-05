const winston = require('winston');
const { mongoService } = require('../repository');

const collectionName = 'shows';

const saveShows = (() => {
  const saveAll = (shows, callback) => {
    if (shows.length === 0) {
      callback(null, shows);
    } else {
      mongoService.getMongoInstance((errInstance, mongo) =>
        mongo.addMany(shows, collectionName, (err) => {
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