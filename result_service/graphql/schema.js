const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    ping: String
    document(ticketId: String!): Document
  }
  type Document {
    title: String!,
    content: Content,
    author: String!
    topic: Topic,
    watermark: String,
    ticketId: String
  }
  enum Content {
    book
    journal
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
