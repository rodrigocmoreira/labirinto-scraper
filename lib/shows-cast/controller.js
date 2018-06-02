const winston = require('winston');

const controller = (() => {
  const statusOk = 200;

  const showsCastController = (req, res) => {
    const page = req.query.page | 0;
    winston.info('Started to get shows with cast');

    const result = {
        shows: []
    };

    res.status(statusOk).send(result);
    winston.info('Finished request');
  };

  return {
    showsCastController
  };
})();

module.exports = controller;
