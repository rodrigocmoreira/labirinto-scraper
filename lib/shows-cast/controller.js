const winston = require('winston');
const service = require('./service');

const controller = (() => {
  const statusOk = 200;
  const internalError = 500;

  const showsCastController = (req, res) => {
    const page = req.query.page || 0;
    winston.info('Started to get shows with cast');

    service.findShowsWithCast(page, (err, result) => {
      if (err) {
        res.status(internalError).send();
        winston.info('Finished request with error: %s', err);
      } else {
        res.status(statusOk).send(result);
        winston.info('Finished request with success');
      }
    });
  };

  return {
    showsCastController
  };
})();

module.exports = controller;
