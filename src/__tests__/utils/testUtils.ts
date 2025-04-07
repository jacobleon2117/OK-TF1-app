// src/__tests__/utils/testUtils.ts
import { act } from 'react-test-renderer';
import { StackNavigationProp } from '@react-navigation/stack';

/**
 * Wraps an async function with act() to handle state updates in tests
 * @param fn Async function to be wrapped
 * @returns A function that can be awaited safely in tests
 */
export const asyncAct = async (fn: () => Promise<void>) => {
  await act(async () => {
    await fn();
  });
};

/**
 * Wraps synchronous state updates with act()
 * @param fn Synchronous function to be wrapped
 */
export const syncAct = (fn: () => void) => {
  act(() => {
    fn();
  });
};

/**
 * Create a mock navigation prop for testing
 * @param routeName Specific route name to create navigation for
 * @returns A mock navigation prop
 */
export function createMockNavigation<
  T extends Record<string, object | undefined>, 
  K extends keyof T
>(routeName: K): StackNavigationProp<T, K> {
  return {
    navigate: jest.fn(),
    dispatch: jest.fn(),
    goBack: jest.fn(),
    getState: jest.fn(),
    setParams: jest.fn(),
    reset: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    isFocused: jest.fn(),
    route: { name: routeName as string },
  } as unknown as StackNavigationProp<T, K>;
}