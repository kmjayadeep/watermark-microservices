const uuidv4 = require('uuid/v4');
const { publishEvent } = require('../lib/cloudEvent');

const rootValue = {
  ping: () => 'pong',
  requestWatermark: async (document) => {
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
    const documentMessage = await publishEvent('watermark-document', JSON.stringify(documentEvent));
    const statusMessage = await publishEvent('watermark-status', JSON.stringify(statusEvent));
    console.log(documentMessage, statusMessage);
    return {
      ticketId,
      timestamp,
    }
  },
};

exports.rootValue = rootValue;
