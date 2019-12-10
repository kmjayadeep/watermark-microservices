const chakram = require('chakram');
const fetch = require('node-fetch');
const mlog = require('mocha-logger');

const { expect } = chakram;

const ticketingService = 'http://ticketing-service.default.34.82.141.113.nip.io/'
const statusService = 'http://status-service.default.34.82.141.113.nip.io/';
const resultService = 'http://status-service.default.34.82.141.113.nip.io/';

describe("Ticketing Service", function () {
  it("Should be running", function () {
    const response = chakram.get(ticketingService);
    expect(response).to.have.status(200);
    return chakram.wait();
  });

  it('Should return tickets when requesting watermarks using fetch', async function () {
    const query = `
      mutation {
        requestWatermark(content:book,title:"my-test-title",author:"me",topic:business) {
          ticketId
          timestamp
        }
      }
    `;
    const response = await fetch("http://ticketing-service.default.34.82.141.113.nip.io/graphql", {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        variables: null
      }),
      "method": "POST",
    });
    const result = await response.json();
    expect(result).to.have.property('data');
    expect(result.data).to.have.property('requestWatermark');
    expect(result.data.requestWatermark).to.have.property('ticketId');
    expect(result.data.requestWatermark.ticketId).to.be.a('string');
    mlog.success('Got ticketId', result.data.requestWatermark.ticketId, 'for request with', query);
  });

});

describe.skip("Status Service", function () {
  it("Should be running", function () {
    const response = chakram.get(statusService);
    expect(response).to.have.status(200);
    return chakram.wait();
  });
});

describe.skip("Result Service", function () {
  it("Should be running", function () {
    const response = chakram.get(resultService);
    expect(response).to.have.status(200);
    return chakram.wait();
  });
});

