/**
 * @fileOverview  Initializing Cloud Firestore access
 * @author Gerd Wagner
 * @author Juan-Francisco Reyes
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore-lite.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClVak7MBFHUFdXDTLzgpsZ1_kF8xBQzlU",
  authDomain: "dancetastic-630ca.firebaseapp.com",
  projectId: "dancetastic-630ca",
  storageBucket: "dancetastic-630ca.appspot.com",
  messagingSenderId: "143721661478",
  appId: "1:143721661478:web:520ee923eeeb6dc26c12e7"
};

// Initialize Firebase
initializeApp(firebaseConfig);
// Initialize Cloud Firestore interface
const fsDb = getFirestore();

export { fsDb };
