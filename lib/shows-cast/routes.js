const { showsCastController } = require('./controller');

module.exports = (app) => {
  app.get('/showsCast/', showsCastController);
};
