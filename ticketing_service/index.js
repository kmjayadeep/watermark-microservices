const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const { publishEvent } = require('./lib/cloudEvent');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('watermark ticketing service');
});

app.get('/test', async (req, res) => {
    const message = await publishEvent('document', JSON.stringify({topic:'Test-topic'}))
    res.json(`sent messge ${message}`);
});

app.listen(PORT, () => console.log(`Ticketing service app listening on port ${PORT}!`));

