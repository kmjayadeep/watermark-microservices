
const sinon = require('sinon');
const { expect } = require('chai');
const { pingRequest, indexRequest } = require('../controllers/watermarkController');
const { graphQlMiddleware } = require('../controllers/graphqlController');

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

  describe('#Graphql endpoint', () => {

    it('Should respond to graphql queries', async () => {
      const req = {
        method: 'POST',
        headers: {}
      }
      const res = {
        setHeader: sinon.spy(),
        // end: (t)=>console.log(t.toString()),
        end: sinon.spy(),
      }
      await graphQlMiddleware(req, res);
      expect(res.end.args).to.be.string;
      const response = res.end.args.toString();
      const result = JSON.parse(response);
      expect(result).to.have.property('errors');
      expect(result.errors).to.be.an('array').with.length(1);
      expect(result.errors[0].message).to.equal('Must provide query string.');
    })
  })
})
