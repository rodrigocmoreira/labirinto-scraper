const bodyParser = require('body-parser');
const express = require('express');
const expressWinston = require('express-winston');
const helmet = require('helmet');
const Datastore = require('nedb');
const winston = require('winston');
const { config } = require('../lib/commons');
const { dbService } = require('../lib/repository');
const { core } = require('../lib/scraper');
const showsCast = require('../lib/shows-cast');
const packageJson = require('../package.json');

const app = express();
const env = process.env.NODE_ENV;

let serverProcess;

const server = (() => {
  const start = () => {
    app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ]
    }));
    app.use(helmet());
    app.use(bodyParser.json({
      type: '*/*'
    }));
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    showsCast.routes(app);

    serverProcess = app.listen(config.get('PORT'), () => {
      winston.info('%s - Version: %s', packageJson.name, packageJson.version);
      if (env === 'production') {
        winston.info('------------------------------------------------------------------');
        winston.info('ATTENTION, %s ENVIRONMENT!', env);
        winston.info('------------------------------------------------------------------');
      } else {
        winston.warn('ENVIRONMENT: %s', env);
      }
      winston.info('Express server listening on port: %s', serverProcess.address().port);
    });
    return app;
  };

  const close = (callback) => {
    if (serverProcess) {
      serverProcess.close(callback);
    }
  };

  const scraper = async function scraper() {
    const db = await dbService.getDBInstance(new Datastore());
    winston.info('Cleaning existing shows before scraping data');
    await db.clean();
    try {
      winston.info('Starting TVmaze scraped');
      core.scraperExecution();
    } catch (error) {
      winston.info(`Error while scrapping: ${error.message}`);
    }
  };

  return {
    close,
    scraper,
    start
  };
})();

module.exports = server;
