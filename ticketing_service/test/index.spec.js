
const sinon = require('sinon');
const { expect } = require('chai');
const { pingRequest, indexRequest } = require('../controllers/watermarkController');

describe('#controllers', () => {
  describe('#watermarkController', () => {
    it('Should respond pong to ping request', () => {
      const res = {
        send: sinon.spy()
      }
      pingRequest(undefined, res);
      expect(res.send.calledWith('pong')).to.be.true;
    });

    it('Should respond to root request', () => {
      const res = {
        send: sinon.spy()
      }
      indexRequest(undefined, res);
      expect(res.send.calledOnce).to.be.true;
    })
  });
})
