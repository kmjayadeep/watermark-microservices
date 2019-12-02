const uuidv4 = require('uuid/v4');

const rootValue = {
  ping: () => 'pong',
  requestWatermark: async (document) => {
    const ticketId = uuidv4();
    const timestamp = new Date().toString();
    const status = 'none';
    const documentEvent = {
      document,
      ticketId,
      timestamp
    }
    const statusEvent = {
      ticketId,
      status
    }
    return {
      ticketId,
      timestamp,
    }
  },
};

exports.rootValue = rootValue;
