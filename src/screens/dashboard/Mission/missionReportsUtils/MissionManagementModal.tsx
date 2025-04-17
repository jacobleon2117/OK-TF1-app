import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { createMission, joinMission } from '@/screens/dashboard/Map/mapUtils/mapUtils';

interface Mission {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: number;
  active: boolean;
  participants: string[];
}

interface MissionManagementModalProps {
  visible: boolean;
  onClose: () => void;
  onMissionCreated: (missionId: string) => void;
  onMissionJoined: (missionId: string) => void;
}

const MissionManagementModal: React.FC<MissionManagementModalProps> = ({
  visible,
  onClose,
  onMissionCreated,
  onMissionJoined,
}) => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [missionTitle, setMissionTitle] = useState('');
  const [missionDescription, setMissionDescription] = useState('');
  const [missionCode, setMissionCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);

  useEffect(() => {
    // Reset form when modal opens
    if (visible) {
      setMissionTitle('');
      setMissionDescription('');
      setMissionCode('');
      loadActiveMissions();
    }
  }, [visible]);

  const loadActiveMissions = async () => {
    // This would be replaced by a real Firebase query in a production app
    setLoadingMissions(true);

    // Simulating network delay
    setTimeout(() => {
      const mockMissions: Mission[] = [
        {
          id: '1',
          title: 'Downtown Search',
          description: 'Search and rescue operation in downtown area',
          createdBy: 'Admin',
          createdAt: Date.now() - 3600000, // 1 hour ago
          active: true,
          participants: ['Admin', 'User1', 'User2'],
        },
        {
          id: '2',
          title: 'River Patrol',
          description: 'Monitor river banks for flooding risks',
          createdBy: 'Coordinator',
          createdAt: Date.now() - 7200000, // 2 hours ago
          active: true,
          participants: ['Coordinator', 'User3'],
        },
      ];

      setActiveMissions(mockMissions);
      setLoadingMissions(false);
    }, 1000);
  };

  const handleCreateMission = async () => {
    if (!missionTitle.trim()) {
      Alert.alert('Error', 'Please enter a mission title');
      return;
    }

    try {
      setIsLoading(true);

      // In a real app, this would call Firebase
      // For now, simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const missionId = `mission-${Date.now()}`; // Mock ID

      // This would be replaced with actual Firebase call
      // const missionId = await createMission(
      //   userData?.id || '',
      //   missionTitle,
      //   missionDescription
      // );

      setIsLoading(false);

      Alert.alert(
        'Mission Created',
        `Mission "${missionTitle}" has been created successfully. Share the mission code with your team: ${missionId
          .substring(0, 6)
          .toUpperCase()}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onMissionCreated(missionId);
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating mission:', error);
      Alert.alert('Error', 'Failed to create mission. Please try again.');
    }
  };

  const handleJoinMission = async () => {
    if (!missionCode.trim()) {
      Alert.alert('Error', 'Please enter a mission code');
      return;
    }

    try {
      setIsLoading(true);

      // In a real app, this would call Firebase
      // For now, simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock mission ID
      const missionId = 'mission-' + missionCode.toLowerCase();

      // This would be replaced with actual Firebase call
      // await joinMission(missionId, userData?.id || '');

      setIsLoading(false);

      Alert.alert('Mission Joined', 'You have successfully joined the mission.', [
        {
          text: 'OK',
          onPress: () => {
            onMissionJoined(missionId);
            onClose();
          },
        },
      ]);
    } catch (error) {
      setIsLoading(false);
      console.error('Error joining mission:', error);
      Alert.alert('Error', 'Failed to join mission. Please verify the mission code and try again.');
    }
  };

  const handleJoinExistingMission = (mission: Mission) => {
    Alert.alert('Join Mission', `Do you want to join the mission "${mission.title}"?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Join',
        onPress: async () => {
          try {
            setIsLoading(true);

            // In a real app, this would call Firebase
            // For now, simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // This would be replaced with actual Firebase call
            // await joinMission(mission.id, userData?.id || '');

            setIsLoading(false);

            Alert.alert(
              'Mission Joined',
              `You have successfully joined the mission "${mission.title}".`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    onMissionJoined(mission.id);
                    onClose();
                  },
                },
              ]
            );
          } catch (error) {
            setIsLoading(false);
            console.error('Error joining mission:', error);
            Alert.alert('Error', 'Failed to join mission. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Mission Management</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'create' && styles.activeTab]}
              onPress={() => setActiveTab('create')}
            >
              <Text style={styles.tabText}>Create Mission</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'join' && styles.activeTab]}
              onPress={() => setActiveTab('join')}
            >
              <Text style={styles.tabText}>Join Mission</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'create' ? (
            <ScrollView style={styles.tabContent}>
              <Text style={styles.inputLabel}>Mission Title</Text>
              <TextInput
                style={styles.input}
                value={missionTitle}
                onChangeText={setMissionTitle}
                placeholder="Enter mission title"
                placeholderTextColor="#777"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={missionDescription}
                onChangeText={setMissionDescription}
                placeholder="Enter mission description"
                placeholderTextColor="#777"
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateMission}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Mission</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView style={styles.tabContent}>
              <Text style={styles.inputLabel}>Enter Mission Code</Text>
              <TextInput
                style={styles.input}
                value={missionCode}
                onChangeText={setMissionCode}
                placeholder="Enter 6-digit mission code"
                placeholderTextColor="#777"
                autoCapitalize="characters"
                maxLength={6}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleJoinMission}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Join Mission</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Active Missions</Text>

              {loadingMissions ? (
                <ActivityIndicator color="#F09737" style={styles.loadingIndicator} />
              ) : activeMissions.length > 0 ? (
                activeMissions.map(mission => (
                  <TouchableOpacity
                    key={mission.id}
                    style={styles.missionItem}
                    onPress={() => handleJoinExistingMission(mission)}
                  >
                    <View>
                      <Text style={styles.missionTitle}>{mission.title}</Text>
                      <Text style={styles.missionDescription}>{mission.description}</Text>
                      <Text style={styles.missionMeta}>
                        Created by {mission.createdBy} • {mission.participants.length} participants
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noMissionsText}>No active missions found</Text>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#F09737',
  },
  tabText: {
    color: '#fff',
    fontWeight: '500',
  },
  tabContent: {
    padding: 16,
    maxHeight: 500,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#F09737',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  missionItem: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  missionDescription: {
    color: '#bbb',
    fontSize: 14,
    marginTop: 4,
  },
  missionMeta: {
    color: '#777',
    fontSize: 12,
    marginTop: 8,
  },
  noMissionsText: {
    color: '#777',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 16,
  },
  loadingIndicator: {
    marginVertical: 16,
  },
});

export default MissionManagementModal;
