const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    ping: String
  },
  type Mutation {
    requestWatermark(content: String!, title: String!, author: String!, topic: Topic): Ticket
  }
  type Ticket {
    ticketId: String
    timestamp: String
  }
  enum Topic{
    business,
    science,
    media
  }
`);

exports.schema = schema;
