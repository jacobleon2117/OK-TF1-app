import React from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { ScreenHeader, BottomNavigation } from '@/components/common/dashboard';
import { DASHBOARD_NAV_ITEMS } from '@/constants/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MessagesScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader title="Messages" onBack={handleBackNavigation} />

      <ScrollView style={styles.messageContainer}>
        {/* Message list will be populated from Firebase later */}
        {/* We could include a MessagesList component here when implemented */}
      </ScrollView>

      <BottomNavigation
        navigation={navigation}
        currentScreen="Messages"
        items={DASHBOARD_NAV_ITEMS}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  messageContainer: {
    flex: 1,
    marginBottom: 80,
  },
});

export default MessagesScreen;
