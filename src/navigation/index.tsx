import React from 'react';
import { 
  NavigationContainer 
} from '@react-navigation/native';
import { 
  createStackNavigator, 
  StackScreenProps 
} from '@react-navigation/stack';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';

// Import screens
import LoginScreen from '@/screens/auth/LoginScreen';
import SignupScreen from '@/screens/auth/SignupScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import ScheduleScreen from '@/screens/dashboard/ScheduleScreen';
import AdminScheduleScreen from '@/screens/dashboard/AdminScheduleScreen';
import LoadingScreen from '@/components/LoadingScreen';

// Import auth context
import { useAuth } from '../context/AuthContext';

// Type definition for navigation
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Calendar: undefined;
};

// Create stack navigator
const Stack = createStackNavigator<RootStackParamList>();

// Auth navigator - for unauthenticated users
const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ 
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// Main navigator - focused on schedule screens
const MainNavigator = () => {
  const { userData } = useAuth();

  console.log('User Data in Navigation:', userData);
  console.log('Is Admin:', userData?.role === 'admin');

  const isAdmin = userData?.role === 'admin';

  return (
<Stack.Navigator 
  initialRouteName="Calendar"
  screenOptions={{ headerShown: false }}
>
  <Stack.Screen 
    name="Calendar" 
    component={isAdmin ? AdminScheduleScreen : ScheduleScreen} 
  />
</Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { user, userData, loading, error, setError } = useAuth();

  console.log('Navigation State:', {
    user: user ? user.uid : 'No User',
    userData,
    loading,
    error
  });

  if (loading) {
    return (
      <LoadingScreen 
        visible={true} 
        message={`Loading user data${user ? ` for ${user.email}` : ''}`} 
      />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={() => setError(null)}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryText: {
    color: '#FF8C00',
    fontSize: 16,
  },
});

export default AppNavigator;