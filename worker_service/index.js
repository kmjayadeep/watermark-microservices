const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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


app.post('/', (req, res) => {
  const event = req.body;

  console.log(event);
  res.json(event)

  // res.status(400).send('Unable to consume event');
});

app.listen(PORT, () => console.log(`worker service app listening on port ${PORT}!`));
