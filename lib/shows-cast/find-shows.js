const config = require('../commons/conf');

const radix = 10;
const pageSize = parseInt(config.get('PAGE_SIZE'), radix);
const collectionName = 'shows';

const findShows = (() => {
  const withCast = (page, mongo, callback) => {
    const lastId = ((page + 1) * pageSize);
    const firstId = lastId - pageSize;

    const query = {
      id: { $gte: firstId, $lt: lastId }
    };

    const projection = {
      _id: 0
    };

    const sort = {
      id: 1
    };

    mongo.findShows(query, projection, sort, collectionName, (err, result) => {
      result.forEach((show) => {
        const sortedShow = show;
        sortedShow.cast = show.cast.sort((castA, castB) =>
          castA.birthday.getTime() - castB.birthday.getTime());
      });
      return callback(err, result);
    });
  };

  return {
    withCast
  };
})();

module.exports = findShows;
