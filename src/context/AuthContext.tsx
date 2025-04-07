import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  User, 
  UserCredential, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Define types for the AuthContext
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

// Export the AuthContext to be used in other parts of the app
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// The AuthProvider component provides the context value to its children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify organization code
  const verifyOrganizationCode = (code: string): boolean => {
    // For now, we'll just check if it's "123456"
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
    setError(null); // Clear previous errors
    
    try {
      if (!verifyOrganizationCode(organizationCode)) {
        throw new Error("Invalid organization code");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err; // Re-throw to allow caller to handle
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, organizationCode: string): Promise<UserCredential> => {
    setError(null); // Clear previous errors
    
    try {
      if (!verifyOrganizationCode(organizationCode)) {
        throw new Error("Invalid organization code");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: name,
        email: email,
        organizationCode: organizationCode,
        role: 'employee', // default role
        createdAt: new Date(),
      });

      setUser(userCredential.user);
      return userCredential;
    } catch (err: any) {
      const errorMessage = err.message || "Signup failed";
      setError(errorMessage);
      throw err; // Re-throw to allow caller to handle
    }
  };

  // Logout function
  const logout = async () => {
    setError(null); // Clear previous errors
    
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      const errorMessage = err.message || "Logout failed";
      setError(errorMessage);
      throw err; // Re-throw to allow caller to handle
    }
  };

  // Reset password function
  const resetPassword = async (email: string, organizationCode: string) => {
    setError(null); // Clear previous errors
    
    try {
      if (!verifyOrganizationCode(organizationCode)) {
        throw new Error("Invalid organization code");
      }

      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const errorMessage = err.message || "Password reset failed";
      setError(errorMessage);
      throw err; // Re-throw to allow caller to handle
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
