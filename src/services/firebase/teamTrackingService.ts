import { db } from '@/config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
  GeoPoint,
} from 'firebase/firestore';

const getCurrentTimestamp = (): number => {
  return Date.now();
};

export interface Team {
  id: string;
  userId: string;
  userName: string;
  dogId: string;
  dogName: string;
  breed: string;
  status: 'active' | 'inactive' | 'on-duty' | 'off-duty';
  lastUpdated: number;
  location?: GeoPoint;
  heading?: number; // Direction in degrees (0-360)
  speed?: number; // Speed in mph
  notes?: string;
}

export interface PositionUpdate {
  teamId: string;
  location: GeoPoint;
  heading?: number;
  speed?: number;
  timestamp: number;
  accuracy?: number; // GPS accuracy in meters
  batteryLevel?: number; // Device battery level percentage
}

const teamsCollection = collection(db, 'teams');
const getTeamPositionsCollection = (teamId: string) => collection(db, 'teams', teamId, 'positions');

export const createTeam = async (team: Omit<Team, 'id' | 'lastUpdated'>): Promise<string> => {
  const teamId = doc(teamsCollection).id;
  const newTeam: Team = {
    ...team,
    id: teamId,
    lastUpdated: getCurrentTimestamp(),
  };

  await setDoc(doc(teamsCollection, teamId), newTeam);
  return teamId;
};

export const getTeam = async (teamId: string): Promise<Team | null> => {
  const teamDoc = await getDoc(doc(teamsCollection, teamId));
  return teamDoc.exists() ? (teamDoc.data() as Team) : null;
};

export const getAllTeams = async (): Promise<Team[]> => {
  const teamsSnapshot = await getDocs(teamsCollection);
  return teamsSnapshot.docs.map(doc => doc.data() as Team);
};

export const getActiveTeams = async (): Promise<Team[]> => {
  const activeTeamsQuery = query(teamsCollection, where('status', '==', 'on-duty'));
  const teamsSnapshot = await getDocs(activeTeamsQuery);
  return teamsSnapshot.docs.map(doc => doc.data() as Team);
};

export const updateTeam = async (teamId: string, teamData: Partial<Team>): Promise<void> => {
  const teamRef = doc(teamsCollection, teamId);
  await updateDoc(teamRef, {
    ...teamData,
    lastUpdated: getCurrentTimestamp(),
  });
};

export const updateTeamStatus = async (teamId: string, status: Team['status']): Promise<void> => {
  await updateTeam(teamId, { status });
};

export const updateTeamPosition = async (positionUpdate: PositionUpdate): Promise<void> => {
  const { teamId, location, heading, speed, timestamp, accuracy, batteryLevel } = positionUpdate;

  // Update the team's current position
  await updateTeam(teamId, {
    location,
    heading,
    speed,
    lastUpdated: timestamp,
  });

  // Store position history in team's subcollection
  const positionId = doc(getTeamPositionsCollection(teamId)).id;
  await setDoc(doc(getTeamPositionsCollection(teamId), positionId), {
    ...positionUpdate,
    id: positionId,
  });
};

export const getTeamPositionHistory = async (
  teamId: string,
  startTime?: number,
  endTime?: number
): Promise<PositionUpdate[]> => {
  let positionQuery = query(getTeamPositionsCollection(teamId));

  if (startTime) {
    positionQuery = query(positionQuery, where('timestamp', '>=', startTime));
  }

  if (endTime) {
    positionQuery = query(positionQuery, where('timestamp', '<=', endTime));
  }

  const positionsSnapshot = await getDocs(positionQuery);
  return positionsSnapshot.docs.map(doc => doc.data() as PositionUpdate);
};

export const subscribeToTeamPosition = (
  teamId: string,
  callback: (team: Team) => void
): (() => void) => {
  return onSnapshot(doc(teamsCollection, teamId), doc => {
    if (doc.exists()) {
      callback(doc.data() as Team);
    }
  });
};

export const subscribeToActiveTeams = (callback: (teams: Team[]) => void): (() => void) => {
  const activeTeamsQuery = query(teamsCollection, where('status', '==', 'on-duty'));

  return onSnapshot(activeTeamsQuery, snapshot => {
    const teams = snapshot.docs.map(doc => doc.data() as Team);
    callback(teams);
  });
};

export const getTeamsInArea = async (center: GeoPoint, radiusInKm: number): Promise<Team[]> => {
  // This is a simplified implementation
  // For production, consider using a geohashing solution like GeoFirestore
  const teams = await getAllTeams();

  return teams.filter(team => {
    if (!team.location) return false;

    // Calculate distance using the Haversine formula
    const distance = calculateDistance(
      center.latitude,
      center.longitude,
      team.location.latitude,
      team.location.longitude
    );

    return distance <= radiusInKm;
  });
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
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
