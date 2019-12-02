// function return document details from ticketId
const getDocumentByTicketId = (ticketId) => {
  const { db } = require('./firestore');
  const docRef = db.collection('document').doc(ticketId);
  return docRef.get();
}

exports.getDocumentByTicketId = getDocumentByTicketId;
