const express = require('express');
const express_graphql = require('express-graphql');
const { schema } = require('./graphql/schema');
const { rootValue } = require('./graphql/rootValue');
const { publishEvent } = require('./lib/cloudEvent');
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/graphql', express_graphql({
  schema,
  rootValue,
  graphiql: process.env.NODE_ENV == 'development'
}));

app.get('/', (_, res) => {
  res.send('watermark ticketing service');
});

// heartbeat
app.get('/ping', (_, res)=>{
  res.send('pong');
})

app.get('/test', async (req, res) => {
  const message = await publishEvent('document', JSON.stringify({ topic: 'Test-topic' }))
  res.json(`sent messge ${message}`);
});

app.listen(PORT, () => console.log(`Ticketing service app listening on port ${PORT}!`));

