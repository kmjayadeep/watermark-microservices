const fetch = require('node-fetch');

const graphqlFetch = require('../utils/graphqlFetch');
const { statusService, statusGraphqlEndpoint } = require('../config/config');

const ping = () => {
  return fetch(`${statusService}/ping`).then(res => res.text());
}

const getStatus = (ticketId) => {
  const query = `
      query getStatus($ticketId:String!) {
        document(ticketId: $ticketId) {
          ticketId
          status
          updatedOn
        }
      }
    `;
  return graphqlFetch(statusGraphqlEndpoint, {
    query,
    variables: {
      ticketId
    }
  });
}

module.exports = {
  ping,
  getStatus,  
}
