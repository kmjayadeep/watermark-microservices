const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { publishEvent } = require('./lib/cloudEvent');
const { timerPromise } = require('./lib/timerPromise');

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
  const { rawBody } = req;
  const event = JSON.parse(rawBody);
  console.log('got event', event);

  const { ticketId, document } = event;

  if (typeof ticketId == 'undefined' || ticketId == '') {
    console.log('Got invalid ticketid, ignoring request');
    return res.send('Invalid format');
  }

  const watermark = 'WATERMARK : ' + JSON.stringify(document) + ' ' + Date.now();

  const pendingStatusEvent = {
    ticketId,
    status: 'PENDING',
  }

  console.log('publishing status event', pendingStatusEvent);
  await publishEvent('watermark-status', JSON.stringify(pendingStatusEvent));

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

  console.log('publishing status event', finishedStatusEvent);
  await publishEvent('watermark-status', JSON.stringify(finishedStatusEvent));

  res.send('Event accepted');
});

app.listen(PORT, () => console.log(`worker service app listening on port ${PORT}!`));
