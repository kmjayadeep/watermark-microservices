const express = require('express');
const express_graphql = require('express-graphql');
const bodyParser = require('body-parser');
const { schema } = require('./graphql/schema');
const { rootValue } = require('./graphql/rootValue');
const { updateStatusByTicketId } = require('./db/status');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/graphql', express_graphql({
  schema,
  rootValue,
  graphiql: process.env.NODE_ENV == 'development'
}));

app.get('/', (_, res) => {
  res.send('watermark status service');
});

// heartbeat
app.get('/ping', (_, res) => {
  res.send('pong');
})

// route for handling events from knative
app.post('/', async (req, res) => {
  const event = req.body;
  const { status, ticketId } = event;
  await updateStatusByTicketId(ticketId, status);
  res.send('Event Accepted');
})

if (process.env.NODE_ENV == 'development') {
  app.get('/test-query', async (_, res) => {
    const { getDocumentByTicketId } = require('./db/document');
    try {
      const doc = await getDocumentByTicketId('uuid-test');
      if (!doc.exists) {
        console.log('No such document!');
        res.json({});
      } else {
        console.log('Document data:', doc.data());
        res.json(doc.data());
      }
    } catch (error) {
      res.json(error)
    }
  });
}

app.listen(PORT, () => console.log(`status service app listening on port ${PORT}!`));

