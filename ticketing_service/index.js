const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { pingRequest, indexRequest } = require('./controllers/watermarkController');
const { graphQlMiddleware } = require('./controllers/graphqlController');

app.get('/', indexRequest);

// heartbeat
app.get('/ping', pingRequest)

//Graphql middleware
app.use('/graphql', graphQlMiddleware);

app.listen(PORT, () => console.log(`Ticketing service app listening on port ${PORT}!`));

module.exports = app;
