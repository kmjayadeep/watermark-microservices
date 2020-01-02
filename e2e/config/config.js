
const ticketingService = 'http://ticketing-service.default.35.241.244.35.nip.io'
const statusService = 'http://status-service.default.35.241.244.35.nip.io';
const resultService = 'http://result-service.default.35.241.244.35.nip.io';
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
