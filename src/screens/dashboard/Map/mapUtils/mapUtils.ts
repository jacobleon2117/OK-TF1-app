import * as Location from 'expo-location';
import { Alert } from 'react-native';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  GeoPoint,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Define types
export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface CustomPin {
  id: string;
  coordinate: Coordinate;
  title: string;
  description: string;
  type: string;
  createdBy: string;
  timestamp: number;
  missionId?: string;
}

export type PinType = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export const PIN_TYPES: PinType[] = [
  { id: 'standard', name: 'Standard', icon: 'location-pin', color: '#F09737' },
  { id: 'alert', name: 'Alert', icon: 'warning', color: '#ff6b6b' },
  { id: 'info', name: 'Info', icon: 'info', color: '#4BB543' },
  { id: 'meeting', name: 'Meeting', icon: 'people', color: '#3498db' },
  { id: 'danger', name: 'Danger', icon: 'dangerous', color: '#e74c3c' },
];

// Location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'This app needs access to your location to show it on the map.',
        [{ text: 'OK' }]
      );
      return null;
    }

    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Pin functions for Firestore
export const addPinToFirestore = async (pin: Omit<CustomPin, 'id'>): Promise<string> => {
  try {
    const pinsRef = collection(db, 'pins');

    const pinData = {
      coordinate: new GeoPoint(pin.coordinate.latitude, pin.coordinate.longitude),
      title: pin.title,
      description: pin.description,
      type: pin.type,
      createdBy: pin.createdBy,
      timestamp: Timestamp.fromMillis(pin.timestamp),
      missionId: pin.missionId || null,
    };

    const docRef = await addDoc(pinsRef, pinData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding pin to Firestore:', error);
    throw new Error('Failed to save pin');
  }
};

export const fetchPins = async (missionId?: string): Promise<CustomPin[]> => {
  try {
    const pinsRef = collection(db, 'pins');
    let pinsQuery = pinsQuery;

    if (missionId) {
      pinsQuery = query(pinsRef, where('missionId', '==', missionId));
    }

    const querySnapshot = await getDocs(pinsQuery);
    const pins: CustomPin[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      pins.push({
        id: doc.id,
        coordinate: {
          latitude: data.coordinate.latitude,
          longitude: data.coordinate.longitude,
        },
        title: data.title,
        description: data.description,
        type: data.type,
        createdBy: data.createdBy,
        timestamp: data.timestamp.toMillis(),
        missionId: data.missionId,
      });
    });

    return pins;
  } catch (error) {
    console.error('Error fetching pins:', error);
    return [];
  }
};

export const updatePin = async (pinId: string, updates: Partial<CustomPin>): Promise<void> => {
  try {
    const pinRef = doc(db, 'pins', pinId);

    const updateData: any = {};

    if (updates.coordinate) {
      updateData.coordinate = new GeoPoint(
        updates.coordinate.latitude,
        updates.coordinate.longitude
      );
    }

    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.type) updateData.type = updates.type;

    await updateDoc(pinRef, updateData);
  } catch (error) {
    console.error('Error updating pin:', error);
    throw new Error('Failed to update pin');
  }
};

export const deletePin = async (pinId: string): Promise<void> => {
  try {
    const pinRef = doc(db, 'pins', pinId);
    await deleteDoc(pinRef);
  } catch (error) {
    console.error('Error deleting pin:', error);
    throw new Error('Failed to delete pin');
  }
};

// Map Utilities
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Haversine formula to calculate distance between two points on Earth
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const getPinIcon = (type: string): string => {
  const pin = PIN_TYPES.find(pin => pin.id === type);
  return pin ? pin.icon : 'location-pin';
};

export const getPinColor = (type: string): string => {
  const pin = PIN_TYPES.find(pin => pin.id === type);
  return pin ? pin.color : '#F09737';
};

// Mission management
export const createMission = async (
  userId: string,
  title: string,
  description: string
): Promise<string> => {
  try {
    const missionsRef = collection(db, 'missions');

    const missionData = {
      title,
      description,
      createdBy: userId,
      createdAt: Timestamp.now(),
      active: true,
      participants: [userId],
    };

    const docRef = await addDoc(missionsRef, missionData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating mission:', error);
    throw new Error('Failed to create mission');
  }
};

export const joinMission = async (missionId: string, userId: string): Promise<void> => {
  try {
    const missionRef = doc(db, 'missions', missionId);

    await updateDoc(missionRef, {
      participants: [userId],
    });
  } catch (error) {
    console.error('Error joining mission:', error);
    throw new Error('Failed to join mission');
  }
};

export const endMission = async (missionId: string): Promise<void> => {
  try {
    const missionRef = doc(db, 'missions', missionId);

    await updateDoc(missionRef, {
      active: false,
      endedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error ending mission:', error);
    throw new Error('Failed to end mission');
  }
};

// User preferences
export interface MapPreferences {
  zoomControlsPosition: 'left' | 'right';
  pinToolbarPosition: 'top' | 'bottom';
  defaultMapType: 'standard' | 'satellite' | 'hybrid' | 'terrain';
  trackLocation: boolean;
}

export const saveMapPreferences = async (
  userId: string,
  preferences: MapPreferences
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      'preferences.map': preferences,
    });
  } catch (error) {
    console.error('Error saving map preferences:', error);
    throw new Error('Failed to save preferences');
  }
};

export const getMapPreferences = async (userId: string): Promise<MapPreferences | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDocs(userRef as any);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.preferences?.map || null;
    }

    return null;
  } catch (error) {
    console.error('Error getting map preferences:', error);
    return null;
  }
};
