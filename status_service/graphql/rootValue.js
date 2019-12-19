const { getStatusByTicketId } = require('../db/status');

const rootValue = {
  ping: () => 'pong',
  document: async ({ ticketId }) => {
    try {
      const doc = await getStatusByTicketId(ticketId);
      if (doc.exists){
        const { status, updatedOn } = doc.data();
        const updatedDate = new Date(updatedOn._seconds * 1000).toISOString();
        const result = {
          ticketId,
          status,
          updatedOn: updatedDate
        };
        return result;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

exports.rootValue = rootValue;
