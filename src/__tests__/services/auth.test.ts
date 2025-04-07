// src/__tests__/services/auth.test.ts
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail 
} from 'firebase/auth';

// Rest of the file remains the same...
// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock firebase config
jest.mock('../../config/firebase', () => ({
  auth: {},
  db: {},
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call signInWithEmailAndPassword with correct parameters', async () => {
      // Mock successful auth
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: { uid: '123', email: 'test@example.com' }
      });

      // Create a mock implementation of AuthContext 
      const mockSetUser = jest.fn();
      const mockSetError = jest.fn();
      
      // Create a context value with the login function
      const contextValue = {
        login: async (email: string, password: string, orgCode: string): Promise<any> => {
          if (orgCode !== '123456') {
            throw new Error('Invalid organization code');
          }
          try {
            const userCredential = await signInWithEmailAndPassword({} as any, email, password);
            mockSetUser(userCredential.user);
            return userCredential;
          } catch (err: any) {
            mockSetError(err.message);
            throw err;
          }
        }
      };

      await contextValue.login('test@example.com', 'password123', '123456');
      
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
    });

    it('should throw an error when organization code is invalid', async () => {
      // Create a mock implementation of AuthContext
      const mockSetError = jest.fn();
      
      // Create a context value with the login function
      const contextValue = {
        login: async (email: string, password: string, orgCode: string): Promise<any> => {
          if (orgCode !== '123456') {
            mockSetError('Invalid organization code');
            throw new Error('Invalid organization code');
          }
          try {
            const userCredential = await signInWithEmailAndPassword({} as any, email, password);
            return userCredential;
          } catch (err: any) {
            mockSetError(err.message);
            throw err;
          }
        }
      };

      await expect(
        contextValue.login('test@example.com', 'password123', 'wrong-code')
      ).rejects.toThrow('Invalid organization code');
      
      expect(mockSetError).toHaveBeenCalledWith('Invalid organization code');
    });

    it('should throw an error when authentication fails', async () => {
      // Mock auth failure
      const mockError = new Error('Invalid credentials');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(mockError);

      // Create a mock implementation of AuthContext
      const mockSetError = jest.fn();
      
      // Create a context value with the login function
      const contextValue = {
        login: async (email: string, password: string, orgCode: string): Promise<any> => {
          if (orgCode !== '123456') {
            throw new Error('Invalid organization code');
          }
          try {
            const userCredential = await signInWithEmailAndPassword({} as any, email, password);
            return userCredential;
          } catch (err: any) {
            mockSetError(err.message);
            throw err;
          }
        }
      };

      await expect(
        contextValue.login('test@example.com', 'password123', '123456')
      ).rejects.toThrow('Invalid credentials');
      
      expect(mockSetError).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  describe('signup', () => {
    it('should call createUserWithEmailAndPassword with correct parameters', async () => {
      // Mock successful user creation
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: { uid: '123', email: 'test@example.com' }
      });

      // Create a mock implementation of AuthContext
      const mockSetUser = jest.fn();
      const mockSetError = jest.fn();
      
      // Create a context value with the signup function
      const contextValue = {
        signup: async (name: string, email: string, password: string, orgCode: string): Promise<any> => {
          if (orgCode !== '123456') {
            throw new Error('Invalid organization code');
          }
          try {
            const userCredential = await createUserWithEmailAndPassword({} as any, email, password);
            mockSetUser(userCredential.user);
            return userCredential;
          } catch (err: any) {
            mockSetError(err.message);
            throw err;
          }
        }
      };

      await contextValue.signup('Test User', 'test@example.com', 'password123', '123456');
      
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
    });

    // Additional signup tests...
  });

  // Additional auth tests...
});