// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyA7q_ZjRFlsOqecSria-rB9lye9QnMKkJ4",
  authDomain: "cocreatehubindia-2ab8d.firebaseapp.com",
  projectId: "cocreatehubindia-2ab8d",
  storageBucket: "cocreatehubindia-2ab8d.firebasestorage.app",
  messagingSenderId: "953391198575",
  appId: "1:953391198575:web:0c376f648617a79cf4f89a",
  measurementId: "G-5FJ8RJXVKK"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
