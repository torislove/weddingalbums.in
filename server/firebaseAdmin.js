import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK using modern ESM modular API
export const adminApp = !getApps().length
  ? initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'weddingalbums-b4bcd',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'weddingalbums-b4bcd.firebasestorage.app'
    })
  : getApps()[0];

export const adminAuth = getAuth(adminApp);
export const adminMessaging = getMessaging(adminApp);
export const adminStorage = getStorage(adminApp);
export const adminFirestore = getFirestore(adminApp);

/**
 * Verify a Firebase ID Token received from frontend Google/Phone OTP login
 */
export async function verifyFirebaseToken(idToken) {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth is not initialized');
  }
  return await adminAuth.verifyIdToken(idToken);
}

/**
 * Send Web Push FCM Notification to a user device
 */
export async function sendPushNotification(fcmToken, title, body, data = {}) {
  if (!adminMessaging) {
    console.warn('Firebase Messaging not initialized; skipping push');
    return null;
  }
  try {
    const message = {
      token: fcmToken,
      notification: {
        title,
        body
      },
      data: {
        ...data,
        click_action: data.url || '/'
      }
    };
    return await adminMessaging.send(message);
  } catch (error) {
    console.error('Error sending FCM push notification:', error.message);
    return null;
  }
}

export default adminApp;
