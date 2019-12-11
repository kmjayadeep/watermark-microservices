const fetch = require('node-fetch');

const graphqlFetch = require('../utils/graphqlFetch');
const { resultService, resultGraphqlEndpoint } = require('../config/config');

const ping = () => {
  return fetch(`${resultService}/ping`).then(res => res.text());
}

const getResult = (ticketId) => {
  const query = `
      query getResult($ticketId:String!) {
        document(ticketId: $ticketId) {
          title
          content
          watermark
          author
          ticketId
        }
      }
    `;
  return graphqlFetch(resultGraphqlEndpoint, {
    query,
    variables: {
      ticketId
    }
  });
}

module.exports = {
  ping,
  getResult,
}
