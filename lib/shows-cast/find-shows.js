const config = require('../commons/conf');

const pageSize = config.get('PAGE_SIZE');

const find = (() => {
  const withCast = (page, db, callback) => {
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

    db.find(query, projection, sort, (err, result) => {
      result.forEach((show) => {
        const formatedShow = show;
        formatedShow.cast.sort((castA, castB) => {
          if (!castA.birthday) {
            return 1;
          }
          if (!castB.birthday) {
            return -1;
          }
          return castA.birthday.getTime() - castB.birthday.getTime();
        });

        formatedShow.cast.forEach((cast) => {
          const formatedCast = cast;
          if (formatedCast.birthday) {
            const formatedBirthday = formatedCast.birthday.toISOString().split('T')[0];
            formatedCast.birthday = formatedBirthday;
          }
        });
      });
      return callback(err, result);
    });
  };

  return {
    withCast
  };
})();

module.exports = find;
