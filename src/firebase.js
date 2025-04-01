import { db } from './firebase';

export const addAvailability = (userId, date, availabilityData) => {
  const availabilityRef = db.collection('schedules')
    .doc(userId)
    .collection('availability')
    .doc(date);

  return availabilityRef.set(availabilityData, { merge: true }); // merge updates existing data
};

export const getAvailability = (userId, date) => {
  const availabilityRef = db.collection('schedules')
    .doc(userId)
    .collection('availability')
    .doc(date);

  return availabilityRef.get();
};

export const addShift = (shiftData) => {
  return db.collection('shifts')
    .add(shiftData);
};

export const getShiftsForDate = (date) => {
  return db.collection('shifts')
    .where('startTime', '>=', firebase.firestore.Timestamp.fromDate(new Date(date)))
    .where('endTime', '<=', firebase.firestore.Timestamp.fromDate(new Date(date)))
    .get();
};

export const updateShiftStatus = (shiftId, status) => {
  return db.collection('shifts')
    .doc(shiftId)
    .update({
      status,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
};

export const assignUserToShift = (shiftId, userData) => {
  const shiftRef = db.collection('shifts').doc(shiftId);
  return shiftRef.update({
    assignedUsers: firebase.firestore.FieldValue.arrayUnion(userData)
  });
};

export const getShiftById = (shiftId) => {
  return db.collection('shifts').doc(shiftId).get();
};

export const deleteShift = (shiftId) => {
  return db.collection('shifts').doc(shiftId).delete();
};

export const createTimeOffRequest = (timeOffData) => {
  return db.collection('timeOffRequests').add(timeOffData);
};

export const getTimeOffRequestsForUser = (userId) => {
  return db.collection('timeOffRequests')
    .where('userId', '==', userId)
    .get();
};

export const updateTimeOffRequest = (requestId, updatedData) => {
  return db.collection('timeOffRequests')
    .doc(requestId)
    .update(updatedData);
};

export const deleteTimeOffRequest = (requestId) => {
  return db.collection('timeOffRequests')
    .doc(requestId)
    .delete();
};

export const createRecurringShift = (recurringShiftData) => {
  return db.collection('recurringShifts').add(recurringShiftData);
};

export const getRecurringShiftsForTeam = (teamId) => {
  return db.collection('recurringShifts')
    .where('teamId', '==', teamId)
    .where('active', '==', true)
    .get();
};

export const updateRecurringShift = (recurringShiftId, updatedData) => {
  return db.collection('recurringShifts')
    .doc(recurringShiftId)
    .update(updatedData);
};

export const deleteRecurringShift = (recurringShiftId) => {
  return db.collection('recurringShifts')
    .doc(recurringShiftId)
    .delete();
};

// Create a shift template
export const createShiftTemplate = (templateData) => {
  return db.collection('shiftTemplates').add(templateData);
};

export const getShiftTemplateById = (templateId) => {
  return db.collection('shiftTemplates').doc(templateId).get();
};

export const updateShiftTemplate = (templateId, updatedData) => {
  return db.collection('shiftTemplates').doc(templateId).update({
    ...updatedData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
};

export const deleteShiftTemplate = (templateId) => {
  return db.collection('shiftTemplates').doc(templateId).delete();
};

// Performins a batch update with array of updates
export const performBatchUpdate = async (updates) => {
  const batch = db.batch();
  updates.forEach(({ ref, data }) => {
    batch.update(ref, data);
  });
  try {
    await batch.commit();
    console.log('Batch update successful');
  } catch (error) {
    console.error('Batch update failed:', error);
  }
};