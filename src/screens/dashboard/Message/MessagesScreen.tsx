import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Modal,
  Text,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { EmptyState } from '@/components/common/dashboard';
import BottomNavigation from '@/components/common/dashboard/BottomNavigation';
import { Ionicons } from '@expo/vector-icons';
import HeaderWithNotifications from '@/components/common/HeaderWithNotifications';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MessagesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [newConversationModalVisible, setNewConversationModalVisible] = useState(false);

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <HeaderWithNotifications
        title="Messages"
        showBackButton={true}
        onBackPress={handleBackNavigation}
        rightComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setNewConversationModalVisible(true)}
          >
            <Ionicons name="add-circle" size={28} color="#F09737" />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.messagesCard}>
          <EmptyState icon="envelope-o" message="No messages available" />
        </View>
      </View>

      {/* New Conversation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={newConversationModalVisible}
        onRequestClose={() => setNewConversationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Conversation</Text>
              <TouchableOpacity
                onPress={() => setNewConversationModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Select a teammate to message:</Text>

            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={40} color="#666" />
              <Text style={styles.emptyStateText}>No teammates available</Text>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavigation currentScreen="Messages" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  messagesCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#666',
    marginTop: 12,
    fontSize: 16,
  },
});

export default MessagesScreen;
