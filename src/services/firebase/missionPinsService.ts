import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getMissionById } from './missionService';

export interface MissionPin {
  type: 'brokenHouse' | 'floodedHouse' | 'boat' | 'fire' | 'bodyFound' | 'rescuedPeople';
  userId: string;
  timestamp: Timestamp;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  imageUrls?: string[];
  additionalDetails?: {
    rescueCount?: number;
    fireIntensity?: string;
  };
  id?: string;
}

//========================================
// PIN FUNCTIONS
//========================================

export const addMissionPin = async (
  missionId: string,
  pinData: MissionPin
): Promise<DocumentReference> => {
  return await addDoc(collection(db, 'missions', missionId, 'pins'), pinData);
};

export const getMissionPinById = async (
  missionId: string,
  pinId: string
): Promise<DocumentSnapshot> => {
  const pinRef = doc(db, 'missions', missionId, 'pins', pinId);
  return await getDoc(pinRef);
};

export const getAllMissionPins = async (missionId: string): Promise<QuerySnapshot> => {
  return await getDocs(collection(db, 'missions', missionId, 'pins'));
};

export const updateMissionPin = async (
  missionId: string,
  pinId: string,
  updatedData: Partial<MissionPin>
): Promise<void> => {
  const pinRef = doc(db, 'missions', missionId, 'pins', pinId);
  return await updateDoc(pinRef, updatedData);
};

export const deleteMissionPin = async (missionId: string, pinId: string): Promise<void> => {
  const pinRef = doc(db, 'missions', missionId, 'pins', pinId);
  await deleteDoc(pinRef);
};
