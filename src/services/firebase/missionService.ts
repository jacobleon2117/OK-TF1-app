import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp,
  DocumentReference,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';


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
}

// CREATE NEW MISSION
export const createMission = async (
  missionData: MissionData
): Promise<DocumentReference> => {
  return await addDoc(collection(db, 'missions'), missionData);
}

export const getMissionById = async (
  missionId: string
): Promise<DocumentSnapshot> => {
  const missionRef = doc(db, 'missions', missionId);
  return await getDoc(missionRef);
}

export const updateMission = async (
  missionId: string,
  updateData: Partial<MissionData>
): Promise<void> => {
  const missionRef = doc(db, 'missions', missionId);
  await updateDoc(missionRef, updateData);
}

export const deleteMission = async (
  missionId: string
): Promise<void> => {
  const missionRef = doc(db, 'missions', missionId);
  await deleteDoc(missionRef);
}