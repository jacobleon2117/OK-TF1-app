import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
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
    return true; // Always true for now
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
        setError('User document not found');
      }
    } catch (err: any) {
      console.error('Detailed Error fetching user data:', {
        code: err.code,
        message: err.message,
        name: err.name,
        stack: err.stack,
      });

      setLoading(false);
      setError(err.message || 'Unable to fetch user data');
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
      if (!verifyOrganizationCode(organizationCode)) {
        console.log('Organization Code Verification Failed');
        throw new Error('Invalid organization code');
      }

      console.log('Attempting Firebase Sign In');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      console.log('Sign In Successful:', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      });

      setUser(userCredential.user);

      console.log('Fetching User Data');
      await fetchUserData(userCredential.user.uid);

      setLoading(false);
    } catch (err: any) {
      console.error('Login Error:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
      });

      setLoading(false);
      setError(err.message || 'Login failed');
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
