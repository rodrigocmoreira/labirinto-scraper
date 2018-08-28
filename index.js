const winston = require('winston');
const { name: packageName } = require('./package.json');
const application = require('./lib/application');

const shutdown = async () => {
  winston.info('Gracefully shutdown in progress');
  await application.close();
  process.exit(0);
};

const startApplication = async () => {
  await application.start();
  await application.scraper();
  winston.info('[APP] initialized SUCCESSFULLY');
};

process.title = packageName;

process
  .on('SIGTERM', shutdown)
  .on('SIGINT', shutdown)
  .on('SIGHUP', shutdown)
  .on('uncaughtException', (err) => {
    winston.error(`uncaughtException caught the error: ${JSON.stringify(err)}`);
    throw err;
  })
  .on('exit', (code) => {
    winston.info(`Node process exit with code: ${code}`);
  });

winston.info('[APP] Starting application initialization');

try {
  startApplication();
} catch (error) {
  winston.error(`[APP] initialization failed ${JSON.stringify(error)}`);
}
