const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { publishEvent } = require('./lib/cloudEvent');
const { timerPromise } = require('./lib/timerPromise');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.send('watermark worker service');
});

// heartbeat
app.get('/ping', (_, res) => {
  res.send('pong');
})

if (process.env.NODE_ENV == 'development') {
  app.get('/test-worker', async (_, res) => {
    res.json('ok');
  });
}


app.post('/', async (req, res) => {
  const event = req.body;

  const { ticketId, document } = event;
  
  const watermark = 'WATERMARK : ' + JSON.stringify(document) + ' ' + Date.now();

  const pendingStatusEvent = {
    ticketId,
    status: 'PENDING',
  }

  await publishEvent('status', JSON.stringify(pendingStatusEvent));

  // Wait some time before publishing result
  await timerPromise(10000);

  const result = {
    ...document,
    watermark,
  }

  const finishedStatusEvent = {
    ticketId,
    status: 'FINISHED',
    result,
  }

  await publishEvent('status', JSON.stringify(finishedStatusEvent));

  res.send('Event accepted');
});

app.listen(PORT, () => console.log(`worker service app listening on port ${PORT}!`));
