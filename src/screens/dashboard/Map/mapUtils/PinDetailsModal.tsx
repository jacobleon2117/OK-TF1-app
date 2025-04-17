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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  CustomPin,
  PIN_TYPES,
  getPinIcon,
  getPinColor,
  updatePin,
  deletePin,
} from '@/screens/dashboard/Map/mapUtils/mapUtils';

interface PinDetailsModalProps {
  visible: boolean;
  pin: CustomPin | null;
  onClose: () => void;
  onUpdate: (updatedPin: CustomPin) => void;
  onDelete: (pinId: string) => void;
  editable?: boolean;
}

const PinDetailsModal: React.FC<PinDetailsModalProps> = ({
  visible,
  pin,
  onClose,
  onUpdate,
  onDelete,
  editable = true,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pin) {
      setTitle(pin.title);
      setDescription(pin.description);
      setSelectedType(pin.type);
    }
    setEditMode(false);
  }, [pin, visible]);

  if (!pin) return null;

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    try {
      setIsLoading(true);

      const updatedPin: CustomPin = {
        ...pin,
        title,
        description,
        type: selectedType,
      };

      // In a real app, this would update Firestore
      // await updatePin(pin.id, {
      //   title,
      //   description,
      //   type: selectedType,
      // });

      setIsLoading(false);
      setEditMode(false);
      onUpdate(updatedPin);
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating pin:', error);
      Alert.alert('Error', 'Failed to update pin details');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Pin',
      'Are you sure you want to delete this pin? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);

              // In a real app, this would delete from Firestore
              // await deletePin(pin.id);

              setIsLoading(false);
              onDelete(pin.id);
              onClose();
            } catch (error) {
              setIsLoading(false);
              console.error('Error deleting pin:', error);
              Alert.alert('Error', 'Failed to delete pin');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editMode ? 'Edit Pin' : 'Pin Details'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            {!editMode ? (
              // View Mode
              <View style={styles.pinDetails}>
                <View style={styles.pinTypeIndicator}>
                  <MaterialIcons
                    name={getPinIcon(pin.type) as any}
                    size={32}
                    color={getPinColor(pin.type)}
                  />
                  <View style={styles.pinTitleContainer}>
                    <Text style={styles.pinTitle}>{pin.title}</Text>
                    <Text style={styles.pinType}>
                      {PIN_TYPES.find(t => t.id === pin.type)?.name || 'Standard'}
                    </Text>
                  </View>
                </View>

                <View style={styles.pinDetail}>
                  <Text style={styles.pinDetailLabel}>Description</Text>
                  <Text style={styles.pinDetailText}>{pin.description || 'No description'}</Text>
                </View>

                <View style={styles.pinDetail}>
                  <Text style={styles.pinDetailLabel}>Created By</Text>
                  <Text style={styles.pinDetailText}>{pin.createdBy}</Text>
                </View>

                <View style={styles.pinDetail}>
                  <Text style={styles.pinDetailLabel}>Date Created</Text>
                  <Text style={styles.pinDetailText}>{formatDate(pin.timestamp)}</Text>
                </View>

                <View style={styles.pinDetail}>
                  <Text style={styles.pinDetailLabel}>Coordinates</Text>
                  <Text style={styles.pinDetailText}>
                    {pin.coordinate.latitude.toFixed(6)}, {pin.coordinate.longitude.toFixed(6)}
                  </Text>
                </View>

                {editable && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
                      <Ionicons name="create-outline" size={18} color="#fff" />
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                      <Ionicons name="trash-outline" size={18} color="#fff" />
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              // Edit Mode
              <View style={styles.editForm}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter pin title"
                  placeholderTextColor="#777"
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter pin description"
                  placeholderTextColor="#777"
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.inputLabel}>Pin Type</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.pinTypeSelector}
                >
                  {PIN_TYPES.map(type => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.pinTypeOption,
                        selectedType === type.id && styles.selectedPinType,
                      ]}
                      onPress={() => setSelectedType(type.id)}
                    >
                      <MaterialIcons name={type.icon as any} size={20} color={type.color} />
                      <Text style={styles.pinTypeOptionText}>{type.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditMode(false)}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
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
    maxHeight: '70%',
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
  modalScroll: {
    padding: 16,
  },
  pinDetails: {
    paddingBottom: 16,
  },
  pinTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pinTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  pinTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pinType: {
    color: '#aaa',
    fontSize: 14,
  },
  pinDetail: {
    marginBottom: 16,
  },
  pinDetailLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  pinDetailText: {
    color: '#fff',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editForm: {
    paddingBottom: 16,
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
  pinTypeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pinTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  selectedPinType: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#F09737',
  },
  pinTypeOptionText: {
    color: '#fff',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#555',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#4BB543',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
});

export default PinDetailsModal;
