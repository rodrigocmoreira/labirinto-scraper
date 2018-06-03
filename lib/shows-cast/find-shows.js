const config = require('../commons/conf');

const pageSize = config.get('PAGE_SIZE');
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
      result.forEach(() => {

      });
      return callback(err, result);
    });
  };

  return {
    withCast
  };
})();

module.exports = findShows;
