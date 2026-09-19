import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCOVCihTsQ6A58DuO4AS7lMsWJ4keSiPNQ',
  authDomain: 'project-3ed45.firebaseapp.com',
  projectId: 'project-3ed45',
  storageBucket: 'project-3ed45.firebasestorage.app',
  messagingSenderId: '361677118058',
  appId: '1:361677118058:web:5a01e6ca759dca14e38813',
  measurementId: 'G-7LBMGGYP94',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export const googleProvider = new GoogleAuthProvider();

export function getAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked. Please allow popups for this site.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Contact the administrator.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}