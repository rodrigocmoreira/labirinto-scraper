const winston = require('winston');
const { dbService } = require('../repository');

const saveShows = (() => {
  const saveAll = (shows, callback) => {
    if (shows.length === 0) {
      callback(null, shows);
    } else {
      dbService.getDBInstance((errInstance, db) => {
        shows.forEach((show) => {
          if (show.cast) {
            show.cast.forEach((cast) => {
              if (cast.birthday) {
                const formatedCast = cast;
                const dateBirthday = new Date(formatedCast.birthday);
                formatedCast.birthday = dateBirthday;
              }
            });
          }
        });
        db.addMany(shows, (err) => {
          if (err) {
            winston.error('Error saving shows scraped.', err.message);
          } else {
            winston.info(`${shows.length} shows saved: `, JSON.stringify(shows));
          }
          return callback(err, shows);
        });
      });
    }
  };

  return {
    saveAll
  };
})();

module.exports = saveShows;
