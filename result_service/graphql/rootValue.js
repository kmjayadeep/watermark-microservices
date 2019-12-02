const { getDocumentByTicketId } = require('../db/document');

const rootValue = {
  ping: () => 'pong',
  document: async ({ ticketId }) => {
    try {
      const doc = await getDocumentByTicketId(ticketId);
      if (doc.exists)
        return doc.data();
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

exports.rootValue = rootValue;
