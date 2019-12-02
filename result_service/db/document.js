const { db } = require('./firestore');

// Return document details from ticketId
const getDocumentByTicketId = (ticketId) => {
  const docRef = db.collection('document').doc(ticketId);
  return docRef.get();
}

exports.getDocumentByTicketId = getDocumentByTicketId;
