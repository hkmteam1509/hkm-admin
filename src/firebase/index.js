const admin = require("firebase-admin");

var serviceAccount = require("./inductive-seat-298508-firebase-adminsdk-ko8fn-3394016621.json");

// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "inductive-seat-298508.appspot.com"
  })
  // Cloud storage
  const bucket = admin.storage().bucket();
  
  module.exports = {
    bucket
  }