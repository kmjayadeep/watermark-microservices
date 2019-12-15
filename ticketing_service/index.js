const express = require('express');
const express_graphql = require('express-graphql');
const { schema } = require('./graphql/schema');
const { rootValue } = require('./graphql/rootValue');
const app = express();
const PORT = process.env.PORT || 3000;

const { pingRequest, indexRequest } = require('./controllers/watermarkController');

app.use('/graphql', express_graphql({
  schema,
  rootValue,
  graphiql: process.env.NODE_ENV == 'development'
}));

app.get('/', indexRequest);

// heartbeat
app.get('/ping', pingRequest)

app.listen(PORT, () => console.log(`Ticketing service app listening on port ${PORT}!`));

module.exports = app;
