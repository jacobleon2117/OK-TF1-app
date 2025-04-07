// jest.setup.js
import '@testing-library/jest-native/extend-expect';

// Mock global objects
global.setImmediate = jest.fn(callback => setTimeout(callback, 0));

// Silence React Native warnings
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
  ignoreAllLogs: jest.fn(),
}));

// Mock react-native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert = { alert: jest.fn() };
  RN.Platform = {
    OS: 'web',
    select: obj => obj.web || obj.default,
  };
  return RN;
});

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));
