// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, organizationCode: string) => Promise<void>;
  signup: (name: string, email: string, password: string, organizationCode: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string, organizationCode: string) => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify organization code
  const verifyOrganizationCode = (code: string): boolean => {
    // For now, we'll just check if it's "123456"
    // In a real app, you'd verify this against your database
    return code === "123456";
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string, organizationCode: string) => {
    setError(null);
    try {
      // Verify organization code first
      if (!verifyOrganizationCode(organizationCode)) {
        throw new Error("Invalid organization code");
      }

      // Then attempt login
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, organizationCode: string) => {
    setError(null);
    try {
      // Verify organization code first
      if (!verifyOrganizationCode(organizationCode)) {
        throw new Error("Invalid organization code");
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Here you would also store additional user data in Firestore
      // For example, the user's name and organization code
      // This requires adding Firestore to your project
      
      // For now, we'll just update the user's display name
      // await updateProfile(userCredential.user, { displayName: name });
      
      return userCredential;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Reset password function
  const resetPassword = async (email: string, organizationCode: string) => {
    setError(null);
    try {
      // Verify organization code first
      if (!verifyOrganizationCode(organizationCode)) {
        throw new Error("Invalid organization code");
      }

      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
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