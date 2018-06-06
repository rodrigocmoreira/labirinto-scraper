const ROOT_PATH = process.cwd();
const nconf = require('nconf');

nconf.argv()
  .env()
  .file(`${ROOT_PATH}/config/labirinto-scraper.json`)
  .defaults();

module.exports = nconf;
