const { db } = require('./firestore');

// Return document details from ticketId
const getStatusByTicketId = (ticketId) => {
  const ref = db.collection('status').doc(ticketId);
  return ref.get();
}

const updateStatusByTicketId = (ticketId, status) => {
  const ref = db.collection('status').doc(ticketId);
  return ref.set({
    ticketId,
    status,
    updatedOn: new Date()
  });
}

exports.getStatusByTicketId = getStatusByTicketId;
exports.updateStatusByTicketId = updateStatusByTicketId;
