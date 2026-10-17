/* eslint-disable no-undef */
// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA1sYKOxveT1DU3m1ZCmVUEKUg8eWNzGeI",
  authDomain: "weddingalbums-b4bcd.firebaseapp.com",
  projectId: "weddingalbums-b4bcd",
  storageBucket: "weddingalbums-b4bcd.firebasestorage.app",
  messagingSenderId: "898839169256",
  appId: "1:898839169256:web:f7b7ce45be5c59fbc9615d",
  measurementId: "G-QB4CS98X26"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification?.title || payload.data?.title || 'WeddingAlbums.in';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'You have an update regarding your album!',
    icon: payload.notification?.icon || '/images/media-notification-icon.svg',
    badge: '/favicon.ico',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
