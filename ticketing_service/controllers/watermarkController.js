
const pingRequest = (_, res) => {
  res.send('pong');
}

const indexRequest = (_, res) => {
  res.send('watermark ticketing service');
}

module.exports = {
  pingRequest,
  indexRequest,
};
