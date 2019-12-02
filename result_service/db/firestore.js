const admin = require('firebase-admin');

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.db = db;
