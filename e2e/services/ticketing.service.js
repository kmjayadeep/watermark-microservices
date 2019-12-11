const fetch = require('node-fetch');

const graphqlFetch = require('../utils/graphqlFetch');
const { ticketingService, ticketingGraphqlEndpoint } = require('../config/config');

const ping = () => {
  return fetch(`${ticketingService}/ping`).then(res => res.text());
}

const requestWatermark = (content, title, author, topic) => {
  const query = `
      mutation requestWatermark($content:Content!, $title:String!, $author:String!, $topic: Topic) {
        requestWatermark(content:$content, title:$title, author:$author, topic:$topic) {
          ticketId
          timestamp
        }
      }
    `;
  return graphqlFetch(ticketingGraphqlEndpoint, {
    query,
    variables: {
      content,
      title,
      author,
      topic
    }
  });
}

module.exports = {
  ping,
  requestWatermark
}
