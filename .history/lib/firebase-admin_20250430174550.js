const admin = require('firebase-admin');

// Initialize the app with a service account if not already initialized
let app;
try {
  app = admin.app();
} catch (error) {
  // Check if running in development mode (local)
  const useEmulator = process.env.NODE_ENV === 'development';
  
  if (useEmulator) {
    // For development with emulators
    app = admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      const firestoreSettings = {
        host: process.env.FIRESTORE_EMULATOR_HOST,
        ssl: false
      };
      
      admin.firestore().settings(firestoreSettings);
    }
  } else {
    // For production with credentials
    let serviceAccount;
    
    // Try to parse the service account from environment variable
    try {
      serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
      );
    } catch (e) {
      console.error('Error parsing Firebase service account:', e);
      // Fall back to using default credentials
      serviceAccount = undefined;
    }
    
    app = admin.initializeApp({
      credential: serviceAccount 
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
  }
}

// Export the admin SDK
const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
  admin,
  db,
  auth,
  storage
}; 