
const sinon = require('sinon');
const { expect } = require('chai');
const { pingRequest, indexRequest } = require('../controllers/watermarkController');
const { graphQlMiddleware } = require('../controllers/graphqlController');
const { createPubsub, createTopic, publish } = require('../lib/pubsub');

describe('#controllers', () => {
  describe('#watermarkController', () => {
    it('Should respond pong to ping request', () => {
      const res = {
        send: sinon.spy()
      }
      pingRequest(undefined, res);
      expect(res.send.calledWith('pong')).to.be.true;
    });

    it('Should respond to index request', () => {
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
});

describe('#cloudEvents', () => {
  describe('#pubsub', () => {

    it('should create topic', () => {
      const pubsub = {
        createTopic: sinon.spy()
      }
      const topic = 'test-topic';
      createTopic(pubsub, topic);
      expect(pubsub.createTopic.calledWith(topic)).to.be.true;
    })

    it('should publish to topic', () => {
      const mockPublish = {
        publish: sinon.spy()
      };
      const pubsub = {
        topic: sinon.spy(() => mockPublish)
      };
      const topic = 'test-topic';
      const data = 'test-data';
      publish(pubsub, topic, data);
      expect(pubsub.topic.calledWith(topic)).to.be.true;
      const dataBuffer = Buffer.from(data);
      expect(mockPublish.publish.calledWith(dataBuffer)).to.be.true;
    })

    it('should return new pubsub object', () => {
      const pubsub = createPubsub('test-project');
      expect(pubsub).to.not.undefined;
    })

  })
})
