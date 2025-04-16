import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  setError: () => {},
  login: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
    } catch (error: any) {
      console.error('Login error:', error.message);
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    try {
      const unsubscribe = onAuthStateChanged(auth, 
        (user) => {
          console.log('Auth state changed, user:', user ? 'logged in' : 'not logged in');
          setUser(user);
          setLoading(false);
        },
        (error) => {
          console.error('Auth state error:', error.message);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => {
        console.log('Cleaning up auth state listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('Unexpected error in auth setup:', error);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login }}>
      {children}
    </AuthContext.Provider>
  );
}; 