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
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface MissionTeamAssignment {
  userId: string;
  role: 'team_leader' | 'team_member' | 'support';
  status: 'active' | 'injured' | 'evacuated';
  checkinTime: Timestamp;
  checkoutTime: Timestamp;
  id?: string;
}

//=========================================
// TEAM ASSIGNMENT FUNCTIONS
//=========================================

export const addTeamAssignment = async (
  missionId: string,
  assignmentData: MissionTeamAssignment
): Promise<DocumentReference> => {
  return await addDoc(collection(db, 'missions', missionId, 'team_assignments'), assignmentData);
};

export const getTeamAssignmentById = async (
  missionId: string,
  assignmentId: string
): Promise<DocumentSnapshot> => {
  const assignmentRef = doc(db, 'missions', missionId, 'team_assignments', assignmentId);
  return await getDoc(assignmentRef);
};

export const getAllTeamAssignments = async (
  missionId: string
): Promise<QuerySnapshot> => {
  return await getDocs(collection(db, 'missions', missionId, 'team_assignments'));
};

export const updateTeamAssignment = async (
  missionId: string,
  assignmentId: string,
  updatedData: Partial<MissionTeamAssignment>
): Promise<void> => {
  const assignmentRef = doc(db, 'missions', missionId, 'team_assignments', assignmentId);
  await updateDoc(assignmentRef, updatedData);
};

export const deleteTeamAssignment = async (
  missionId: string,
  assignmentId: string
): Promise<void> => {
  const assignmentRef = doc(db, 'missions', missionId, 'team_assignments', assignmentId);
  await deleteDoc(assignmentRef);
};
