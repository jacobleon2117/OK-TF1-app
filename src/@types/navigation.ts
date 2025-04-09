import type { NavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

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

export type RootNavigationProp = NavigationProp<RootStackParamList>;
export type RootStackScreenNavigationProp<RouteName extends keyof RootStackParamList> = 
  StackNavigationProp<RootStackParamList, RouteName>;