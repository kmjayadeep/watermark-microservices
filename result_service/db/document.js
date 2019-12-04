const { db } = require('./firestore');

// Return document details from ticketId
const getDocumentByTicketId = (ticketId) => {
  const docRef = db.collection('document').doc(ticketId);
  return docRef.get();
}

const saveDocument = (ticketId, document) => {
  const ref = db.collection('document').doc(ticketId);
  return ref.set(document);
}

const updateDocument = (ticketId, document) => {
  const ref = db.collection('document').doc(ticketId);
  return ref.set(document, { merge: true });
}

exports.getDocumentByTicketId = getDocumentByTicketId;
exports.saveDocument = saveDocument;
exports.updateDocument = updateDocument;
