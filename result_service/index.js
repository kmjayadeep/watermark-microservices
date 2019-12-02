const express = require('express');
const express_graphql = require('express-graphql');
const { schema } = require('./graphql/schema');
const { rootValue } = require('./graphql/rootValue');
const app = express();
const PORT = process.env.PORT || 3000;

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

if (process.env.NODE_ENV == 'development') {
  app.get('/test-query', async (req, res) => {
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


app.listen(PORT, () => console.log(`result service app listening on port ${PORT}!`));

