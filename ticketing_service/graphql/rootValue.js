const uuidv4 = require('uuid/v4');
const cloudEvent = require('../lib/cloudEvent');

const ping = () => 'pong';

const requestWatermark = async (document) => {
  const ticketId = uuidv4();
  const timestamp = new Date().toString();
  const status = 'NONE';
  const documentEvent = {
    document,
    ticketId,
    timestamp
  }
  const statusEvent = {
    ticketId,
    status
  }
  const publishWatermark = cloudEvent.publishEvent('watermark-document', JSON.stringify(documentEvent));
  const publishStatus = cloudEvent.publishEvent('watermark-status', JSON.stringify(statusEvent));
  await Promise.all([publishWatermark, publishStatus]);
  return {
    ticketId,
    timestamp,
  }
};

const rootValue = {
  ping,
  requestWatermark,
};

module.exports = {
  rootValue,
  ping,
  requestWatermark
}
