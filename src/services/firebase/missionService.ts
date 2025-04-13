import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface OperationArea {
  northEast: Coordinates;
  southWest: Coordinates;
}

export interface Location {
  startingCoordinates: Coordinates;
  operationArea: OperationArea;
}

export interface MissionMetrics {
  totalDistanceCovered: number;
  totalDuration: number;
  averageTeamSpeed: number;
}

export interface PinTypes {
  brokenHouse: number;
  floodedHouse: number;
  boat: number;
  fire: number;
  bodyFound: number;
  rescuedPeople: number;
}

export interface ReportSummary {
  totalPinsDropped: number;
  pinTypes: PinTypes;
}

export interface MissionData {
  coordinatorId: string;
  teamId: string;
  title: string;
  description: string;
  startTime: Timestamp;
  endTime: Timestamp | null;
  status: 'preparing' | 'active' | 'completed' | 'cancelled';
  location: Location;
  missionMetrics: MissionMetrics;
  reportSummary: ReportSummary;
  id?: string;
}

// CREATE NEW MISSION
export const createMission = async (missionData: MissionData): Promise<DocumentReference> => {
  return await addDoc(collection(db, 'missions'), missionData);
};

export const getMissionById = async (missionId: string): Promise<DocumentSnapshot> => {
  const missionRef = doc(db, 'missions', missionId);
  return await getDoc(missionRef);
};

export const updateMission = async (
  missionId: string,
  updateData: Partial<MissionData>
): Promise<void> => {
  const missionRef = doc(db, 'missions', missionId);
  await updateDoc(missionRef, updateData);
};

export const deleteMission = async (missionId: string): Promise<void> => {
  const missionRef = doc(db, 'missions', missionId);
  await deleteDoc(missionRef);
};

// For test compatibility
export const getMission = async (missionId: string): Promise<MissionData | null> => {
  const missionRef = doc(db, 'missions', missionId);
  const missionDoc = await getDoc(missionRef);

  if (missionDoc.exists()) {
    const data = missionDoc.data();
    return { id: missionId, ...data } as MissionData;
  }

  return null;
};

export const getAllMissions = async (): Promise<MissionData[]> => {
  const missionsSnapshot = await getDocs(collection(db, 'missions'));
  return missionsSnapshot.docs.map(doc => {
    const data = doc.data();
    return { id: doc.id, ...data } as MissionData;
  });
};

export const getActiveMissions = async (): Promise<MissionData[]> => {
  const missionsQuery = query(collection(db, 'missions'), where('status', '==', 'active'));

  const missionsSnapshot = await getDocs(missionsQuery);
  return missionsSnapshot.docs.map(doc => {
    const data = doc.data();
    return { id: doc.id, ...data } as MissionData;
  });
};

export const getMissionTeams = async (missionId: string): Promise<string[]> => {
  const missionRef = doc(db, 'missions', missionId);
  const missionDoc = await getDoc(missionRef);

  if (missionDoc.exists()) {
    const data = missionDoc.data() as MissionData;
    return data.teamId ? [data.teamId] : [];
  }

  return [];
};
