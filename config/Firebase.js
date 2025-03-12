const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyATOJXuWND_w0VNXuYpmdZn_7DSRYrtpx8',
  authDomain: 'tripieai.firebaseapp.com',
  projectId: 'tripieai',
  storageBucket: 'tripieai.firebasestorage.app',
  messagingSenderId: '213956386931',
  appId: '1:213956386931:web:d88969abb6daf8bad58a06',
  measurementId: 'G-L2EDF9RQXD',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db };
