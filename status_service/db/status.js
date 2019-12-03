const { db } = require('./firestore');

// Return document details from ticketId
const getStatusByTicketId = (ticketId) => {
  const ref = db.collection('status').doc(ticketId);
  return ref.get();
}

exports.getStatusByTicketId = getStatusByTicketId;
