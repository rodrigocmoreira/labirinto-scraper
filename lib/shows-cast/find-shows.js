const config = require('../commons/conf');

const pageSize = config.get('PAGE_SIZE');
const collectionName = 'shows';

const find = (() => {
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

    mongo.find(query, projection, sort, collectionName, (err, result) => {
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

module.exports = find;
