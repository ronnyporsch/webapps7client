
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyClVak7MBFHUFdXDTLzgpsZ1_kF8xBQzlU",
  authDomain: "dancetastic-630ca.firebaseapp.com",
  projectId: "dancetastic-630ca",
  storageBucket: "dancetastic-630ca.appspot.com",
  messagingSenderId: "143721661478",
  appId: "1:143721661478:web:520ee923eeeb6dc26c12e7"
};

// Initialize a Firebase App object only if not already initialized
const app = (!getApps().length) ? initializeApp( config ) : getApp();
// Initialize Firebase Authentication
const auth = getAuth( app);
// Initialize Firestore interface
const fsDb = getFirestore();

export { auth, fsDb };
