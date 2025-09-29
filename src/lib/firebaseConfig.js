// utils/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA7q_ZjRFlsOqecSria-rB9lye9QnMKkJ4",
  authDomain: "cocreatehubindia-2ab8d.firebaseapp.com",
  projectId: "cocreatehubindia-2ab8d",
  storageBucket: "cocreatehubindia-2ab8d.firebasestorage.app",
  messagingSenderId: "953391198575",
  appId: "1:953391198575:web:0c376f648617a79cf4f89a",
  measurementId: "G-5FJ8RJXVKK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
let messaging;
try {
  messaging = getMessaging(app);
} catch (err) {
  console.log("Firebase messaging not supported", err);
}

export { app, messaging, getToken, onMessage };
