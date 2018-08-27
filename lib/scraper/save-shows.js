const winston = require('winston');
const { dbService } = require('../repository');

const saveShows = (() => {
  const saveAll = async (shows) => {
    if (shows.length === 0) {
      return Promise.resolve(shows);
    }

    try {
      const db = await dbService.getDBInstance();
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
      await db.addMany(shows);
      winston.info(`${shows.length} shows saved: ${JSON.stringify(shows)}`);
      return Promise.resolve(shows);
    } catch (error) {
      winston.error(`Error saving shows scraped. ${error.message}`);
      return Promise.reject(error);
    }
  };

  return {
    saveAll
  };
})();

module.exports = saveShows;
