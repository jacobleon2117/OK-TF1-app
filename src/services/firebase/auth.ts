import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '@/config/firebase';

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Login Error:', {
      code: error.code,
      message: error.message,
    });

    switch (error.code) {
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password');
      case 'auth/user-not-found':
        throw new Error('No user found with this email');
      case 'auth/wrong-password':
        throw new Error('Incorrect password');
      case 'auth/too-many-requests':
        throw new Error('Too many login attempts. Please try again later.');
      case 'auth/network-request-failed':
        throw new Error('Network error. Please check your internet connection.');
      default:
        throw new Error('Login failed. Please try again.');
    }
  }
};

export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return userCredential.user;
  } catch (error: any) {
    console.error('Registration Error:', {
      code: error.code,
      message: error.message,
    });

    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('Email already in use');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/operation-not-allowed':
        throw new Error('Registration is currently disabled');
      case 'auth/weak-password':
        throw new Error('Password is too weak');
      case 'auth/network-request-failed':
        throw new Error('Network error. Please check your internet connection.');
      default:
        throw new Error('Registration failed. Please try again.');
    }
  }
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password Reset Error:', {
      code: error.code,
      message: error.message,
    });

    switch (error.code) {
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/user-not-found':
        throw new Error('No user found with this email');
      case 'auth/network-request-failed':
        throw new Error('Network error. Please check your internet connection.');
      default:
        throw new Error('Password reset failed. Please try again.');
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout Error:', {
      code: error.code,
      message: error.message,
    });
    throw new Error('Logout failed. Please try again.');
  }
};
