const sinon = require('sinon');
const { showsCastController } = require('../../../lib/shows-cast/controller');
const service = require('../../../lib/shows-cast/service');
const winston = require('winston');

describe('Unit Test show-cast Controller', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.spy(winston, 'info');
    sandbox.spy(winston, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#controler execution - Error cases', () => {
    it('Should receive a error during the controller execution', (done) => {
      sandbox.stub(service, 'findShowsWithCast')
        .yields({}, null, {});

      const request = {
        query: {
          page: 0
        }
      };

      const response = {
        status() {
          return response;
        },
        send() {
          return response;
        }
      };

      showsCastController(request, response);
      sinon.assert.calledOnce(service.findShowsWithCast);
      sinon.assert.calledOnce(winston.error);
      sinon.assert.calledOnce(winston.info);
      done();
    });
  });
});
