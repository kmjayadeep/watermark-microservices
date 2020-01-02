const express = require('express');
const express_graphql = require('express-graphql');
const bodyParser = require('body-parser');
const { schema } = require('./graphql/schema');
const { rootValue } = require('./graphql/rootValue');
const { updateStatusByTicketId } = require('./db/status');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(function (req, _, next) {
  const contentType = req.header('content-type');
  if (contentType !== 'application/octet-stream') {
    return next();
  }
  req.rawBody = '';

  req.setEncoding('utf8');

  req.on('data', function (chunk) {
    req.rawBody += chunk;
  });

  req.on('end', function () {
    next();
  });
});

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
  const { rawBody } = req;
  const event = JSON.parse(rawBody);
  console.log('got event', event);
  const { status, ticketId } = event;

  if (typeof ticketId == 'undefined' || ticketId == '') {
    console.log('Got invalid ticketid, ignoring request');
    return res.send('Invalid format');
  }

  try {
    await updateStatusByTicketId(ticketId, status);
    res.send('Event Accepted');
  } catch (error) {
    console.log(error);
    res.status(400).send('Unable to process event');    
  }

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

