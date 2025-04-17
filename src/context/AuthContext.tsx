import React, { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
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
  diagnoseLogin: (email: string, password: string) => Promise<boolean>;
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

  const verifyOrganizationCode = (code: string): boolean => {
    // TODO: Replace with real organization code verification logic
    return code === '123456'; // Example hardcoded validation
  };

  const fetchUserData = async (userId: string) => {
    console.log('Fetching user data for userId:', userId);

    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        console.log('User Document Data:', userData);

        setUserData({
          displayName: userData.displayName,
          email: userData.email,
          organizationCode: userData.organizationCode,
          role: userData.role,
          createdAt:
            userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt),
        });
      } else {
        console.error('No user document found');
        setError('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Unable to fetch user data');
    }
  };

  const diagnoseLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      // Comprehensive network state logging
      const netInfoState = await NetInfo.fetch();
      console.log('Detailed Network Diagnostics:', {
        isConnected: netInfoState.isConnected,
        type: netInfoState.type,
        details: netInfoState.details,
      });

      // Safer network details extraction
      const networkDetails = {
        ipAddress:
          netInfoState.details && 'ipAddress' in netInfoState.details
            ? (netInfoState.details as any).ipAddress
            : 'Unknown',
        carrier:
          netInfoState.details && 'carrier' in netInfoState.details
            ? (netInfoState.details as any).carrier
            : 'Unknown',
      };

      console.log('Network Details:', networkDetails);

      // Additional internet reachability check
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://www.google.com', {
          method: 'HEAD',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('Internet Reachability Test:', {
          status: response.status,
          ok: response.ok,
        });
      } catch (fetchError) {
        console.error('Internet Reachability Fetch Error:', fetchError);
      }

      if (!netInfoState.isConnected) {
        console.error('No network connection detected');
        setError('No internet connection. Please check your network.');
        return false;
      }

      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        console.log('Network Request Details:', {
          methods,
          authDomain: auth.app.options.authDomain,
          projectId: auth.app.options.projectId,
        });

        // If no sign-in methods found, handle accordingly
        if (methods.length === 0) {
          console.error('No sign-in methods found for this email');
          setError('No account found. Please sign up.');
          return false;
        }
      } catch (emailCheckError: any) {
        console.error('Detailed Network Error:', {
          code: emailCheckError.code,
          message: emailCheckError.message,
          stack: emailCheckError.stack,
        });

        setError('Network error. Please check your connection and try again.');
        return false;
      }

      // Attempt to sign in
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User UID:', userCredential.user.uid);

        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          console.log('User Document Data:', userDoc.data());
          return true;
        } else {
          console.error('No user document found in Firestore');
          setError('User document not found');
          return false;
        }
      } catch (signInError: any) {
        console.error('Sign-in Error:', {
          code: signInError.code,
          message: signInError.message,
        });

        const errorMessage = (() => {
          switch (signInError.code) {
            case 'auth/invalid-credential':
              return 'Invalid email or password';
            case 'auth/user-not-found':
              return 'No user found with this email';
            case 'auth/wrong-password':
              return 'Incorrect password';
            case 'auth/too-many-requests':
              return 'Too many login attempts. Please try again later.';
            default:
              return 'Login failed. Please try again.';
          }
        })();

        setError(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Comprehensive Network Check Error:', error);
      setError('Unable to verify network connection');
      return false;
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

  const login = async (email: string, password: string, organizationCode: string) => {
    console.log('Login Attempt:', {
      email,
      organizationCode,
      timestamp: new Date().toISOString(),
    });

    setError(null);
    setLoading(true);

    try {
      // Diagnostic check
      const diagnosticResult = await diagnoseLogin(email, password);
      if (!diagnosticResult) {
        setLoading(false);
        return;
      }

      if (!verifyOrganizationCode(organizationCode)) {
        console.log('Organization Code Verification Failed');
        setError('Invalid organization code');
        setLoading(false);
        return;
      }

      console.log('Login successful');
      setLoading(false);
    } catch (err: any) {
      console.error('Login Method Error:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
      });

      setLoading(false);

      if (!error) {
        setError('Login failed. Please try again.');
      }

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

    try {
      if (!verifyOrganizationCode(organizationCode)) {
        console.log('Organization Code Verification Failed');
        throw new Error('Invalid organization code');
      }

      console.log('Attempting to create user in Firebase');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const userData: UserData = {
        displayName: name,
        email: email,
        organizationCode: organizationCode,
        role: adminCode?.trim() ? 'admin' : 'employee',
        createdAt: new Date(),
      };

      console.log('Creating User Document:', userData);

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      console.log('User Document Created Successfully');

      setUser(userCredential.user);
      setUserData(userData);

      return userCredential;
    } catch (err: any) {
      console.error('Signup Error:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
      });

      const errorMessage = err.message || 'Signup failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);

    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (email: string, organizationCode: string) => {
    setError(null);

    try {
      if (!verifyOrganizationCode(organizationCode)) {
        throw new Error('Invalid organization code');
      }

      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const errorMessage = err.message || 'Password reset failed';
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
