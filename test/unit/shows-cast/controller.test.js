const sinon = require('sinon');
const winston = require('winston');
const { showsCastController } = require('../../../lib/shows-cast/controller');
const service = require('../../../lib/shows-cast/service');

describe('Unit Test show-cast Controller', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.spy(winston, 'info');
    sandbox.spy(winston, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#controler execution - Error cases', () => {
    it('Should receive a error during the controller execution', async () => {
      const errorController = {
        message: 'error on controller'
      };

      sandbox.stub(service, 'findWithCast').rejects(errorController);

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

      await showsCastController(request, response);
      sinon.assert.calledOnce(service.findWithCast);
      sinon.assert.calledOnce(winston.error);
      sinon.assert.calledOnce(winston.info);
    });
  });
});
