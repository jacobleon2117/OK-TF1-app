import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ProfileCardProps {
  profileImage: any;
  displayName: string;
  role: string;
  onEditPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileImage,
  displayName,
  role,
  onEditPress,
}) => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileInfo}>
        <Image source={profileImage} style={styles.profileImage} />
        <View style={styles.nameContainer}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileRole}>{role}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <FontAwesome name="pencil" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameContainer: {
    marginLeft: 12,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileRole: {
    color: '#aaa',
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileCard;
