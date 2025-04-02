import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getMissionById } from './missionService';

export interface MissionLocation {
  userId: string;
  timestamp: Timestamp;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  accuracy: number;
  altitude: number;
  speed: number;
  heading: number;
  roadType: 'paved' | 'dirt' | 'off-road' | 'trail';

}

//=============================================
//  FUNCTIONS
//=============================================

export const addMissionLocation = async (
  missionId: string,
  locationData: MissionLocation
): Promise<DocumentReference> => {
  return await addDoc(collection(db, 'missions', missionId, 'locations'), locationData);
};

export const getMissionLocationById = async (
  missionId: string,
  locationId: string
): Promise<DocumentSnapshot> => {
  const locationRef = doc(db, 'missions', missionId, 'locations', locationId);
  return await getDoc(locationRef);
}

export const getAllMissionLocations = async (
  missionId: string
): Promise<QuerySnapshot> => {
  return await getDocs(collection(db, 'missions', missionId, 'locations'));
}

export const updateMissionLocation = async (
  missionId: string,
  locationId: string,
  updateData: Partial<MissionLocation>
): Promise<void> => {
  const locationRef = doc(db, 'missions', missionId, 'locations', locationId);
  await updateDoc(locationRef, updateData);
}

export const deleteMissionLocation = async (
  missionId: string,
  locationId: string
): Promise<void> => {
  const locationRef = doc(db, 'missions', missionId, 'locations', locationId);
  await deleteDoc(locationRef);
}