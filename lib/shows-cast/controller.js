const winston = require('winston');
const service = require('./service');

const controller = (() => {
  const statusOk = 200;
  const internalError = 500;

  const showsCastController = async (req, res) => {
    const page = +req.query.page || 0;
    winston.info('Started to get shows with cast');

    try {
      const result = await service.findWithCast(page);
      res.status(statusOk).send(result);
      winston.info('Finished request with success');
    } catch (error) {
      res.status(internalError).send();
      winston.error(`Finished request with error: ${error.message}`);
    }
  };

  return {
    showsCastController
  };
})();

module.exports = controller;
