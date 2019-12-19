const chai = require('chai')
const fetch = require('node-fetch');
const mlog = require('mocha-logger');

const sleep = require('../utils/sleep');

const ticketingService = require('../services/ticketing.service');
const statusService = require('../services/status.service');
const resultService = require('../services/result.service');

const { expect } = chai;


describe("Ticketing Service", function () {

  it("Should be running", async function () {
    const response = await ticketingService.ping();
    expect(response).to.equal('pong');
  });

  it('Should return ticketId when requesting watermarks', async function () {
    const params = ['book', 'my-awesome-book', 'me', 'business'];
    const response = await ticketingService.requestWatermark(...params);
    expect(response).to.have.deep.property('data.requestWatermark');
    const { requestWatermark } = response.data;
    expect(requestWatermark).to.have.all.keys('ticketId', 'timestamp');
    expect(requestWatermark.ticketId).to.be.a('string');
    expect(requestWatermark.ticketId).to.not.empty;
    mlog.success('Got ticketId', requestWatermark.ticketId, 'for request with params', params);
  });

});

describe("Status Service", function () {
  it("Should be running", async function () {
    const response = await statusService.ping();
    expect(response).to.equal('pong');
  });

  describe('Test if it returns status of requests', function () {

    let ticketId = '';

    before(async () => {
      mlog.pending('Creating a new request for checking status');
      const response = await ticketingService.requestWatermark('book', 'my-test-title', 'me', 'business');
      ticketId = response.data.requestWatermark.ticketId;
      mlog.log('Got ticketId', ticketId);
    })

    it('Should give correct status', async function () {

      // Wait a few seconds for the event to get propogated
      await sleep(3000);

      const response = await statusService.getStatus(ticketId);

      expect(response).to.have.deep.property('data.document');
      const { document } = response.data;
      expect(document).to.have.all.keys('ticketId', 'status', 'updatedOn');
      expect(document.ticketId).to.equal(ticketId);
      expect(document.status).to.be.oneOf(['FINISHED', 'PENDING', 'NONE']);
      mlog.success('Got request status', document.status);
    })

  })
});

describe("Result Service", function () {
  it("Should be running", async function () {
    const response = await resultService.ping();
    expect(response).to.equal('pong');
  });

  describe('Test if result service is returning documents', () => {

    let ticketId = '';

    before(async () => {
      mlog.pending('Creating a new request for checking result');
      const response = await ticketingService.requestWatermark('book', 'my-test-title', 'me', 'business');
      ticketId = response.data.requestWatermark.ticketId;
      mlog.log('Got ticketId', ticketId);
    });


    it('should return document', async () => {
      // wait for event to get propogated
      await sleep(3000);
      const response = await resultService.getResult(ticketId);

      expect(response).to.have.deep.property('data.document');
      const { document } = response.data;
      expect(document).to.have.all.keys('ticketId', 'title', 'content', 'watermark', 'author');
      expect(document.ticketId).to.equal(ticketId);
      mlog.success('Got document result', `${document.title} ${document.content} ${document.watermark} ${document.author}`);
    });

  });
});

describe('e2e', function () {

  it('Should watermark a given document', async () => {
    const params = ['book', 'my-awesome-book', 'me', 'business'];
    mlog.pending('Creating a new request with params', params);
    const response = await ticketingService.requestWatermark(...params);
    const ticketId = response.data.requestWatermark.ticketId;
    mlog.log('Got ticketId', ticketId);

    let status = null;

    do {
      mlog.pending('Checking status for', ticketId);

      const statusResponse = await statusService.getStatus(ticketId);
      status = statusResponse.data.document ? statusResponse.data.document.status : null;

      mlog.log('Current status is', status);
      await sleep(1000);
    } while (status != 'FINISHED');

    const result = await resultService.getResult(ticketId);
    const { watermark } = result.data.document;

    expect(watermark).to.not.be.null;
    expect(watermark).to.not.be.empty;

    mlog.success('Got watermark', watermark);

  })

});
