import React from 'react';
import { StyleSheet, View, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { ScreenHeader, EmptyState } from '@/components/common/dashboard';
import FloatingBottomNav from '@/components/common/dashboard/BottomNavigation';

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

      <ScrollView style={styles.messagesContainer}>
        <EmptyState icon="envelope-o" message="No messages available" />
      </ScrollView>

      <FloatingBottomNav currentScreen="Messages" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 80,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default MessagesScreen;
