const express = require('express');
const express_graphql = require('express-graphql');
const bodyParser = require('body-parser');
const { schema } = require('./graphql/schema');
const { getDocumentByTicketId, saveDocument, updateDocument } = require('./db/document');
const { rootValue } = require('./graphql/rootValue');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(function(req, _, next) {
  req.rawBody = '';
  req.setEncoding('utf8');
  
  req.on('data', function(chunk) { 
    req.rawBody += chunk;
  });
  
  req.on('end', function() {
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
  res.send('watermark result service');
});

// heartbeat
app.get('/ping', (_, res) => {
  res.send('pong');
})

app.post('/', async (req, res) => {
  const { rawBody } = req;
  const event = JSON.parse(rawBody);
  console.log('got event', event);
  if (event.status) {
    if (event.status != 'FINISHED') {
      // Only accept finshed event
      return res.send('Ignoring event');
    }
    // Got event that watermark has finished

    if (typeof ticketId == 'undefined' || ticketId == '') {
      console.log('Got invalid ticketid, ignoring request');
      return res.send('Invalid format');
    }

    const { ticketId, result } = event;
    await updateDocument(ticketId, {
      watermark: result.watermark
    });
    return res.send('Status event accepted')
  } else if (event.document) {
    // Got an event that a new document was added to queue
    const { ticketId, document } = event;

    if (typeof ticketId === 'undefined' || ticketId === '') {
      console.log('Got invalid ticketid, ignoring request');
      return res.send('Invalid format');
    }


    if(typeof document !== 'object') {
      console.log('Invalid document, ignoring request');
      return res.send('invalid document format');
    }

    await saveDocument(ticketId, {
      ...document,
      ticketId,
    });
    return res.send('Document event accepted');
  } else{
    res.status(400).send('Unsupported event');
  }
})

if (process.env.NODE_ENV == 'development') {
  app.get('/test-query', async (_, res) => {
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


app.listen(PORT, () => console.log(`result service app listening on port ${PORT}!`));

