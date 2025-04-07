import '@testing-library/jest-native';
import 'jest-expo';

// Extend the global types to resolve TypeScript errors
declare global {
  namespace NodeJS {
    interface Global {
      __DEV__: boolean;
    }
  }
}

// Mock for React Native modules
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

// Extend jest matchers
declare namespace jest {
  interface Matchers<R> {
    toBeVisible(): R;
    toBeDisabled(): R;
    toHaveTextContent(text: string): R;
  }
}

export {};