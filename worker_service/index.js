const express = require('express');
const v1 = require("cloudevents-sdk/v1");
const bodyParser = require('body-parser');
const app = express();

// accept application/cloudevents+json
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const receiver = new v1.StructuredHTTPReceiver();

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

app.post('/', (req, res) => {
  const headers = {
    ...req.headers,
    'content-type' : 'application/cloudevents+json'
  }
  try {
    const event = receiver.parse(req.body, headers);
    const formattedEvent = event.format();
    console.log(formattedEvent);
    const data = formattedEvent.data;
    console.log(data);
    res.status(201).send('Event Accepted');
  } catch (err) {
    // TODO deal with errors
    console.error(err);
    res.status(415)
      .header('Content-Type', 'application/json')
      .send(JSON.stringify(err));
  }
});

app.listen(PORT, () => console.log(`worker service app listening on port ${PORT}!`));
