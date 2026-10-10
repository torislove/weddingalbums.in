import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, logEvent as fbLogEvent, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported } from "firebase/messaging";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  signOut as fbSignOut,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  getDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

// Web app Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyA1sYKOxveT1DU3m1ZCmVUEKUg8eWNzGeI",
  authDomain: "weddingalbums-b4bcd.firebaseapp.com",
  projectId: "weddingalbums-b4bcd",
  storageBucket: "weddingalbums-b4bcd.firebasestorage.app",
  messagingSenderId: "898839169256",
  appId: "1:898839169256:web:f7b7ce45be5c59fbc9615d",
  measurementId: "G-QB4CS98X26"
};

// Web Push VAPID key
export const VAPID_KEY = "BFhvtWpTbXO0jt_b5K7sJU6eQiJ1_O6zDlJsA9emI94WEoeS-u44u_xY2vavXI0EUEB0ajvntC9uU8OMXo8IpsU";

// 1. Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// 2. Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with Google Popup and obtain Firebase ID Token
 */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { user: result.user, idToken };
};

/**
 * Setup Invisible or Visible reCAPTCHA Verifier for Phone OTP
 */
export const setupRecaptcha = (containerId = 'recaptcha-container', invisible = true) => {
  if (typeof window === 'undefined') return null;
  // Clear any existing verifier on container
  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear(); } catch (e) {}
  }
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: invisible ? 'invisible' : 'normal',
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA expired');
    }
  });
  return window.recaptchaVerifier;
};

/**
 * Send Phone Verification SMS OTP via Firebase
 */
export const sendPhoneOtpViaFirebase = async (phoneNumber, appVerifier) => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// 3. Firebase Cloud Storage
export const storage = getStorage(app);

/**
 * Upload an album image or file directly to Firebase Cloud Storage with progress callback
 * @param {File|Blob} file 
 * @param {string} storagePath e.g. 'albums/album-123/raw/photo.jpg'
 * @param {function} onProgress callback (percent: number) => void
 * @returns {Promise<{ url: string, path: string }>}
 */
export const uploadFileToStorage = (file, storagePath, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ url: downloadURL, path: storagePath });
      }
    );
  });
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFileFromStorage = async (storagePath) => {
  const storageRef = ref(storage, storagePath);
  return await deleteObject(storageRef);
};

// 4. Firebase Cloud Firestore
export const db = getFirestore(app);

/**
 * Listen to real-time updates for a single Firestore document
 */
export const subscribeToDocument = (collectionName, documentId, callback) => {
  const docRef = doc(db, collectionName, documentId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
};

/**
 * Listen to real-time album review comments
 */
export const listenToAlbumComments = (albumId, callback) => {
  const commentsQuery = query(
    collection(db, `albums/${albumId}/comments`),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(commentsQuery, (snapshot) => {
    const comments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(comments);
  });
};

/**
 * Add a review comment to an album
 */
export const addAlbumComment = async (albumId, commentData) => {
  return await addDoc(collection(db, `albums/${albumId}/comments`), {
    ...commentData,
    createdAt: serverTimestamp()
  });
};

// 5. Firebase Analytics
export let analytics = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics not supported or blocked:", err);
  });
}

export const logAnalyticsEvent = (eventName, params = {}) => {
  if (analytics) {
    try {
      fbLogEvent(analytics, eventName, params);
    } catch (e) {
      console.warn('Analytics event log error:', e);
    }
  }
};

// 6. Firebase Cloud Messaging (Web Push Notifications)
export let messaging = null;

export const initMessaging = async () => {
  if (typeof window === "undefined") return null;
  const supported = await isMessagingSupported().catch(() => false);
  if (!supported) {
    console.warn("Firebase Messaging is not supported in this browser environment.");
    return null;
  }
  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
};

export const requestNotificationPermission = async () => {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("Notifications are not supported in this browser.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission was not granted:", permission);
      return null;
    }

    const msg = await initMessaging();
    if (!msg) return null;

    let registration;
    if ("serviceWorker" in navigator) {
      try {
        registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      } catch (swErr) {
        console.warn("Service worker registration error:", swErr);
      }
    }

    const currentToken = await getToken(msg, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (currentToken) {
      console.log("FCM Device Token:", currentToken);
      return currentToken;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving Firebase Cloud Messaging token:", error);
    return null;
  }
};

export const onForegroundMessage = (callback) => {
  initMessaging().then((msg) => {
    if (msg) {
      onMessage(msg, (payload) => {
        if (callback) callback(payload);
      });
    }
  });
};

export default app;
