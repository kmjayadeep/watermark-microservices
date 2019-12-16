
const sinon = require('sinon');
const assert = require('assert');
const pubsubLib = require('../lib/pubsub');
const cloudEvent = require('../lib/cloudEvent');
const { expect } = require('chai');
const { pingRequest, indexRequest } = require('../controllers/watermarkController');
const { graphQlMiddleware } = require('../controllers/graphqlController');

const { publishEvent } = cloudEvent;
const { ping, requestWatermark, rootValue } = require('../graphql/rootValue');

const { createPubsub, createTopic, publish } = pubsubLib;

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
    });

    describe('#reducers', () => {

      it('ping function should return pong', () => {
        const pong = ping();
        expect(pong).to.equal('pong');
      });

      it('rootvalue should have ping and requestwatermark', () => {
        expect(rootValue.ping).to.equal(ping);
        expect(rootValue.requestWatermark).to.equal(requestWatermark);
      });

      describe('#requestwatermark', () => {

        beforeEach(() => {
          sinon.stub(cloudEvent, 'publishEvent').resolves('test-messageId');
        });

        afterEach(() => {
          cloudEvent.publishEvent.restore();
        });

        it('should generate ticketId and timestamp', async () => {
          const result = await requestWatermark({ title: 'test-document' });
          const { ticketId, timestamp } = result;
          expect(ticketId).to.not.null;
          expect(ticketId).be.a('string');
          expect(ticketId.length).to.equal(36);
          expect(timestamp).to.not.null;
          expect(timestamp).to.be.a('string');
        });

        it('should generate cloud events for document', async () => {
          const mockDoc = { title: 'test-document' };
          await requestWatermark(mockDoc);
          expect(cloudEvent.publishEvent.callCount).to.equal(2);
          const callingArgs = cloudEvent.publishEvent.args;
          const documentEventArgs = callingArgs[0];
          expect(documentEventArgs).to.be.a('array');
          expect(documentEventArgs.length).to.equal(2);
          expect(documentEventArgs[0]).equal('watermark-document');
          const document = JSON.parse(documentEventArgs[1]);
          expect(document).to.have.all.keys('document','ticketId','timestamp');
          expect(document.document).to.eql(mockDoc);
        });

        it('should generate cloud events for status', async () => {
          const mockDoc = { title: 'test-document' };
          await requestWatermark(mockDoc);
          expect(cloudEvent.publishEvent.callCount).to.equal(2);
          const callingArgs = cloudEvent.publishEvent.args;
          const statusEventArgs = callingArgs[1];
          expect(statusEventArgs).to.be.a('array');
          expect(statusEventArgs.length).to.equal(2);
          expect(statusEventArgs[0]).equal('watermark-status');
          const status = JSON.parse(statusEventArgs[1]);
          expect(status).to.have.all.keys('status','ticketId');
          expect(status.status).to.eql('NONE');
        });

      });

    });

  });
});

describe('#lib functions', () => {
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
    });
  })

  describe('#cloudevents', () => {

    const pubsubMock = {};
    const mockMessageId = 'test-messageId';

    beforeEach(() => {
      sinon.stub(pubsubLib, 'createPubsub').callsFake(() => {
        return pubsubMock;
      })
      sinon.stub(pubsubLib, 'publish').callsFake(() => {
        return mockMessageId;
      })
    });
    afterEach(() => {
      pubsubLib.createPubsub.restore();
    });

    it('should be able to publish cloud events', async () => {

      const [testTopic, testData] = ['test-topic', 'test-data'];

      const messageId = await publishEvent(testTopic, testData);

      assert(pubsubLib.createPubsub.calledOnce);
      assert(pubsubLib.publish.calledWith(pubsubMock, testTopic, testData));
      expect(messageId).equal(mockMessageId);
    })
  })
})
