const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    ping: String
    document(ticketId: String!): Document
  }
  type Document {
    ticketId: String
    status: Status
    updatedOn: String
  }
  enum Status {
    NONE,
    PENDING,
    FINISHED
  }
`);

exports.schema = schema;
