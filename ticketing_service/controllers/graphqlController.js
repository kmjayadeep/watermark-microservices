const express_graphql = require('express-graphql');
const { schema } = require('../graphql/schema');
const { rootValue } = require('../graphql/rootValue');

const graphQlMiddleware = express_graphql({
  schema,
  rootValue,
  graphiql: process.env.NODE_ENV == 'development'
});

module.exports = {
  graphQlMiddleware
}
