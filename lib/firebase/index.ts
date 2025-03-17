import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  TwitterAuthProvider,
  signOut as firebaseSignOut,
  User,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// Helper to ensure we're on client side
const ensureClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('This method is only available on the client side');
  }
  if (!auth) {
    throw new Error('Auth is not initialized');
  }
  return auth;
};

export const signInWithTwitter = async () => {
  const auth = ensureClient();
  const provider = new TwitterAuthProvider();
  
  // Set custom parameters for the Twitter provider
  provider.setCustomParameters({
    lang: 'en',
    // Add any additional Twitter OAuth parameters here
  });

  try {
    const result = await signInWithPopup(auth, provider);
    if (!result?.user) {
      throw new Error('No user returned from Twitter sign-in');
    }
    return result;
  } catch (error: any) {
    console.error('Twitter sign-in error:', error);
    // Add more specific error handling
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Pop-up was blocked. Please allow pop-ups for this site.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Twitter login. Please contact support.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Twitter login is not enabled. Please contact support.');
    }
    throw error;
  }
};

export const signOut = async () => {
  const auth = ensureClient();
  await firebaseSignOut(auth);
};

export const listenToAuthChanges = (callback: (user: User | null) => void) => {
  const auth = ensureClient();
  return onAuthStateChanged(auth, callback);
};

export { db, auth };
export * from './auth'; 