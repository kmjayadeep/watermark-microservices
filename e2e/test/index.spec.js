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
    const params = ['book','my-awesome-book','me','business'];
    const response = await ticketingService.requestWatermark(...params);
    expect(response).to.have.deep.property('data.requestWatermark.ticketId');
    expect(response).to.have.deep.property('data.requestWatermark.timestamp');
    expect(response.data.requestWatermark.ticketId).to.be.a('string');
    expect(response.data.requestWatermark.ticketId).to.not.empty;
    mlog.success('Got ticketId', response.data.requestWatermark.ticketId, 'for request with params', params);
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
      const response = await ticketingService.requestWatermark('book','my-test-title','me','business');
      ticketId = response.data.requestWatermark.ticketId;
      mlog.log('Got ticketId', ticketId);
    })

    it('Should give correct status', async function () {

      // Wait a few seconds for the event to get propogated
      await sleep(3000);

      const response = await statusService.getStatus(ticketId);

      expect(response).to.have.deep.property('data.document.ticketId');
      expect(response).to.have.deep.property('data.document.status');
      expect(response).to.have.deep.property('data.document.updatedOn');
      const document = response.data.document;
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
});
