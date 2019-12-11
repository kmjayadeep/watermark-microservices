
const ticketingService = 'http://ticketing-service.default.34.82.141.113.nip.io'
const statusService = 'http://status-service.default.34.82.141.113.nip.io';
const resultService = 'http://status-service.default.34.82.141.113.nip.io';
const ticketingGraphqlEndpoint = `${ticketingService}/graphql`;
const statusGraphqlEndpoint = `${statusService}/graphql`
const resultGraphqlEndpoint = `${resultService}/graphql`

module.exports = {
  ticketingService,
  statusService,
  resultService,
  ticketingGraphqlEndpoint,
  statusGraphqlEndpoint,
  resultGraphqlEndpoint,
}
