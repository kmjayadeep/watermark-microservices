const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { pingRequest, indexRequest } = require('./controllers/watermarkController');
const { graphQlMiddleware } = require('./controllers/graphqlController');
const { createTopic, createPubsub } = require('./lib/pubsub');

app.get('/', indexRequest);

// heartbeat
app.get('/ping', pingRequest)

//Graphql middleware
app.use('/graphql', graphQlMiddleware);

const verifyGoogleCreds = () => {
  try {
    const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    const creds = require(credsPath);
    return creds && creds.project_id;
  } catch (error) {
    return false;
  }
}

const createTopics = async (pubsub) => {
  try {
    await Promise.all([createTopic(pubsub, 'watermark-document'), createTopic(pubsub, 'watermark-status')]);
    return topics;
  } catch (error) {
    return false;
  }
}

const startServer = async (port) => {
  if (!verifyGoogleCreds())
    return console.error('Unable to start server', 'Google credentials are missing');
  const pubsub = createPubsub();
  const topics = await createTopics(pubsub);
  if (!topics)
    console.log('unable to create topics, likely that topic already exists');
  app.listen(port, () => console.log(`Ticketing service app listening on port ${port}!`));
}

if (require.main === module) {
  console.log('starting up');
  startServer(PORT);
}

module.exports = {
  startServer,
  verifyGoogleCreds,
  createTopics
}
