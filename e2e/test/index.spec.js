const chai = require('chai')
const fetch = require('node-fetch');
const mlog = require('mocha-logger');

require("mocha-allure-reporter");

const { expect } = chai;

const ticketingService = 'http://ticketing-service.default.34.82.141.113.nip.io'
const statusService = 'http://status-service.default.34.82.141.113.nip.io';
const resultService = 'http://status-service.default.34.82.141.113.nip.io';
const ticketingGraphqlEndpoint = `${ticketingService}/graphql`;
const statusGraphqlEndpoint = `${statusService}/graphql`;

const graphqlFetch = (endPoint, data) => fetch(endPoint, {
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data),
  method: "POST",
}).then(res => res.json());

const sleep = time => new Promise((resolve) => setTimeout(resolve, time));

describe("Ticketing Service", function () {

  it("Should be running", async function () {
    const response = await fetch(ticketingService);
    expect(response.status).to.equal(200);
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
    const response = await graphqlFetch(ticketingGraphqlEndpoint, {
      query,
      variables: null
    })
    expect(response).to.have.deep.property('data.requestWatermark.ticketId');
    expect(response).to.have.deep.property('data.requestWatermark.timestamp');
    expect(response.data.requestWatermark.ticketId).to.be.a('string');
    expect(response.data.requestWatermark.ticketId).to.not.empty;
    mlog.success('Got ticketId', response.data.requestWatermark.ticketId, 'for request with', query);
  });

});

describe("Status Service", function () {
  it("Should be running", async function () {
    const response = await fetch(statusService);
    expect(response.status).to.equal(200);
  });

  describe('Test if it returns status of requests', function () {

    let ticketId = '';

    before(async () => {
      mlog.pending('Creating a new request for testing');
      const query = `
        mutation {
          requestWatermark(content:book,title:"my-test-title",author:"me",topic:business) {
            ticketId
            timestamp
          }
        }
      `;
      const response = await graphqlFetch(ticketingGraphqlEndpoint, {
        query,
        variables: null
      })
      ticketId = response.data.requestWatermark.ticketId;
      mlog.log('Got ticketId', ticketId);
    })

    it('Should give correct status', async function () {

      // Wait a few seconds for the event to get propogated
      await sleep(3000);

      const query = `
        {
          document(ticketId:"${ticketId}") {
            ticketId
            status
            updatedOn
          }
        }
       `;

      const response = await graphqlFetch(statusGraphqlEndpoint, {
        query,
        variables: null
      });

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
    const response = await fetch(resultService);
    expect(response.status).to.equal(200);
  });
});
