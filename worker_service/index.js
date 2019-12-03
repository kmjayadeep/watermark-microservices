const express = require('express');
const v1 = require("cloudevents-sdk/v1");
const app = express();

const PORT = process.env.PORT || 3000;

// to parse the cloudevents
const bodyParser = (req, _, next) => {
  let data = "";

  req.setEncoding("utf8");
  req.on("data", function (chunk) {
    data += chunk;
  });

  req.on("end", function () {
    req.body = data;
    next();
  });
}


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


app.post('/', bodyParser, (req, res) => {
  const headers = {
    ...req.headers,
    'content-type': 'application/cloudevents+json'
  }
  console.log(req.headers);
  try {
    const receiver = new v1.StructuredHTTPReceiver();
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
