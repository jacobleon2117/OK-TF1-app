// src/__tests__/utils/alertMock.ts
import { Alert } from 'react-native';

/**
 * Set up a mock for React Native Alert
 * @returns A jest spy on Alert.alert
 */
export const setupAlertMock = () => {
  return jest.spyOn(Alert, 'alert');
};

/**
 * Clear all Alert mocks
 */
export const clearAlertMock = () => {
  jest.clearAllMocks();
};

/**
 * Expect an Alert to have been called with specific parameters
 * @param mockAlert The jest spy created by setupAlertMock
 * @param title Expected alert title
 * @param message Expected alert message
 */
export const expectAlertToHaveBeenCalledWith = (
  mockAlert: jest.SpyInstance, 
  title: string, 
  message: string
) => {
  expect(mockAlert).toHaveBeenCalledWith(
    title,
    message,
    expect.any(Array)
  );
};