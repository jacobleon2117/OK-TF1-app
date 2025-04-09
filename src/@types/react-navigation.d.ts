import '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

declare module '@react-navigation/native' {
  export type RootStackParamList = {
    Dashboard: undefined;
    Messages: undefined;
    Calendar: undefined;
    Map: undefined;
    Profile: undefined;
    MissionReports: undefined;
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
  };

  export interface NavigationProp<
    ParamList extends Record<string, object | undefined>,
    RouteName extends keyof ParamList = string
  > {
    navigate(route: RouteName, params?: ParamList[RouteName]): void;
    goBack(): void;
  }
}

declare module '@react-navigation/stack' {
  export interface StackScreenProps<
    ParamList extends Record<string, object | undefined>,
    RouteName extends keyof ParamList = string
  > {
    navigation: StackNavigationProp<ParamList, RouteName>;
  }
}