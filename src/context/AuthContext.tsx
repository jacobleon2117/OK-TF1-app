import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserData {
  displayName: string;
  email: string;
  organizationCode: string;
  role: 'admin' | 'employee';
  createdAt: Date;
}

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string, organizationCode: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    organizationCode: string,
    adminCode?: string
  ) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string, organizationCode: string) => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
  diagnoseLogin: (email: string) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modified to only check if email exists without signing in
  const diagnoseLogin = async (email: string): Promise<boolean> => {
    try {
      console.log('Diagnostic Login Check Started');
      console.log('Email:', email);

      if (!email) {
        console.error('Email is empty');
        setError('Email is required');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.error('Invalid email format');
        setError('Invalid email format');
        return false;
      }

      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        console.log('Available Sign-in Methods:', methods);

        if (methods.length === 0) {
          console.error('No sign-in methods found for this email');
          setError('No account found with this email');
          return false;
        }
        return true;
      } catch (emailCheckError: any) {
        console.error('Email Verification Error:', emailCheckError);
        setError(emailCheckError.message || 'Unable to verify email');
        return false;
      }
    } catch (error: any) {
      console.error('Diagnostic Login Error:', error);
      setError(error.message || 'An unexpected error occurred');
      return false;
    }
  };

  const verifyOrganizationCode = async (code: string): Promise<boolean> => {
    // Implementation of organization code verification
    try {
      // For testing, return true for now
      return true;
    } catch (error) {
      console.error('Organization verification error:', error);
      return false;
    }
  };

  const fetchUserData = async (userId: string) => {
    console.log('Fetching user data for userId:', userId);

    try {
      const userDocRef = doc(db, 'users', userId);
      console.log('User Doc Reference:', userDocRef.path);

      const userDoc = await getDoc(userDocRef);

      console.log('User Doc Exists:', userDoc.exists());

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        console.log('Raw User Data:', userData);

        const completeUserData: UserData = {
          displayName: userData.displayName || '',
          email: userData.email || '',
          organizationCode: userData.organizationCode || '',
          role: userData.role || 'employee',
          createdAt:
            userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt),
        };

        console.log('Complete User Data:', completeUserData);
        setUserData(completeUserData);
        setLoading(false);
      } else {
        console.log('No user document found');
        setLoading(false);
        setError('User profile not found. Please contact support.');
      }
    } catch (err: any) {
      console.error('Detailed Error fetching user data:', err);

      setLoading(false);
      setError('Unable to access your profile. Please try again later.');
    }
  };

  useEffect(() => {
    console.log('Starting onAuthStateChanged listener');

    const unsubscribe = onAuthStateChanged(
      auth,
      async currentUser => {
        console.log('Auth State Changed:', currentUser ? currentUser.uid : 'No User');

        setUser(currentUser);

        if (currentUser) {
          try {
            console.log('Attempting to fetch user data for:', currentUser.uid);
            await fetchUserData(currentUser.uid);
          } catch (error) {
            console.error('Error in onAuthStateChanged fetchUserData:', error);
            setLoading(false);
          }
        } else {
          console.log('No user logged in');
          setUserData(null);
          setLoading(false);
        }
      },
      error => {
        console.error('Auth State Change Error:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('Unsubscribing from auth state changes');
      unsubscribe();
    };
  }, []);

  // Fixed login function
  const login = async (email: string, password: string, organizationCode: string) => {
    console.log('Login Attempt:', {
      email,
      organizationCode,
      timestamp: new Date().toISOString(),
    });

    setError(null);
    setLoading(true);

    try {
      // Verify organization code first
      const isValidOrg = await verifyOrganizationCode(organizationCode);
      if (!isValidOrg) {
        console.log('Organization Code Verification Failed');
        setError('Invalid organization code');
        setLoading(false);
        return;
      }

      // Perform the actual login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful, user:', userCredential.user.uid);
      
      // User data will be fetched by the auth state change listener
    } catch (err: any) {
      console.error('Login Method Error:', err);

      setLoading(false);

      // Provide user-friendly error messages
      const errorMessage = (() => {
        switch (err.code) {
          case 'auth/invalid-credential':
            return 'Invalid email or password';
          case 'auth/user-not-found':
            return 'No user found with this email';
          case 'auth/wrong-password':
            return 'Incorrect password';
          case 'auth/too-many-requests':
            return 'Too many login attempts. Please try again later.';
          case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
          case 'auth/invalid-email':
            return 'Invalid email format';
          case 'auth/configuration-not-found':
            return 'Authentication service is temporarily unavailable. Please try again later.';
          default:
            return 'Login failed. Please try again.';
        }
      })();

      setError(errorMessage);
      throw err;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    organizationCode: string,
    adminCode?: string
  ) => {
    console.log('Signup Attempt:', {
      name,
      email,
      organizationCode,
      adminCode: adminCode ? 'Provided' : 'Not Provided',
      isAdmin: adminCode === 'OKTask1Admin',
    });

    setError(null);
    setLoading(true);

    try {
      const isValidOrg = await verifyOrganizationCode(organizationCode);
      if (!isValidOrg) {
        console.log('Organization Code Verification Failed');
        setError('Invalid organization code');
        setLoading(false);
        throw new Error('Invalid organization code');
      }

      // Create the user
      console.log('Attempting to create user in Firebase');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const userData: UserData = {
        displayName: name,
        email: email,
        organizationCode: organizationCode,
        role: adminCode === 'OKTask1Admin' ? 'admin' : 'employee',
        createdAt: new Date(),
      };

      console.log('Creating User Document:', userData);

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      console.log('User Document Created Successfully');

      setUser(userCredential.user);
      setUserData(userData);
      setLoading(false);

      return userCredential;
    } catch (err: any) {
      console.error('Signup Error:', err);

      setLoading(false);

      // User-friendly error messages
      const errorMessage = (() => {
        switch (err.code) {
          case 'auth/email-already-in-use':
            return 'An account with this email already exists';
          case 'auth/invalid-email':
            return 'Invalid email format';
          case 'auth/weak-password':
            return 'Password is too weak. Use at least 6 characters';
          case 'auth/configuration-not-found':
            return 'Authentication service is temporarily unavailable. Please try again later.';
          default:
            return err.message || 'Signup failed';
        }
      })();

      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);

    try {
      await signOut(auth);
      // Auth state change listener will handle clearing user data
    } catch (err: any) {
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (email: string, organizationCode: string) => {
    setError(null);
    setLoading(true);

    try {
      // Check if email exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        setError('No account found with this email');
        setLoading(false);
        throw new Error('Email not found');
      }

      const isValidOrg = await verifyOrganizationCode(organizationCode);
      if (!isValidOrg) {
        setError('Invalid organization code');
        setLoading(false);
        throw new Error('Invalid organization code');
      }

      await sendPasswordResetEmail(auth, email);
      setLoading(false);
    } catch (err: any) {
      console.error('Password Reset Error:', err);
      setLoading(false);
      
      const errorMessage = (() => {
        switch (err.code) {
          case 'auth/invalid-email':
            return 'Invalid email format';
          case 'auth/user-not-found':
            return 'No account found with this email';
          case 'auth/configuration-not-found':
            return 'Authentication service is temporarily unavailable. Please try again later.';
          default:
            return err.message || 'Password reset failed';
        }
      })();
      
      setError(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    userData,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    error,
    setError,
    diagnoseLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};