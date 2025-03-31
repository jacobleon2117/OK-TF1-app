# MAP

/schedules
  /{userId}               // Document ID is the user ID
    fullName: string      // Duplicated from user profile for quick access
    teamId: string        // Team this user belongs to
    role: string          // User's role (coordinator, handler, responder)
    availability: {       // Nested map of availability data
      "2025-04-01": {     // Using date strings as map keys (YYYY-MM-DD)
        status: string    // "available", "unavailable", "on-call"
        startTime: string // "09:00" (24-hour format)
        endTime: string   // "17:00" (24-hour format)
        notes: string     // Optional notes about availability
      },
      "2025-04-02": {
        // Another day's availability data
      }
    }
    preferredShiftTypes: array // ["morning", "night", "weekend"]
    maxHoursPerWeek: number    // User's preferred max hours
    lastUpdated: timestamp
  
/shifts
  /{shiftId}                   // Auto-generated document ID
    name: string               // "Morning Patrol"
    description: string        // "Morning patrol for northern area"
    missionId: string          // Reference to mission (optional)
    startTime: timestamp       // When the shift starts
    endTime: timestamp         // When the shift ends
    location: {
      name: string             // "Northern Command Post"
      address: string          // Optional address
      coordinates: {           // Optional coordinates
        latitude: number
        longitude: number
      }
    }
    assignedUsers: [           // Array of assigned users
      {
        userId: string         // User ID
        name: string           // User name (duplicated for quick access)
        role: string           // Role for this shift
        status: string         // "confirmed", "pending", "declined"
        assignedAt: timestamp  // When this user was assigned
        checkedIn: boolean     // Whether they've checked in
        checkedInAt: timestamp // When they checked in (if applicable)
      }
    ]
    requiredRoles: [           // Roles needed for this shift
      {
        role: string           // "K9 Handler", "Medical", etc.
        count: number          // How many of this role are needed
        filled: number         // How many have been assigned
      }
    ]
    status: string             // "planned", "active", "completed", "canceled"
    createdBy: string          // User ID who created the shift
    createdAt: timestamp
    updatedAt: timestamp
    notes: string              // Any general notes about the shift

/timeOffRequests
  /{requestId}                 // Auto-generated document ID
    userId: string             // User requesting time off
    userName: string           // User's name (duplicated)
    teamId: string             // User's team
    startDate: timestamp       // Start of time off
    endDate: timestamp         // End of time off
    type: string               // "vacation", "sick", "personal", "training"
    reason: string             // Detailed reason (optional)
    status: string             // "pending", "approved", "denied"
    approvedBy: string         // User ID who approved/denied
    createdAt: timestamp
    updatedAt: timestamp
    notes: string              // Any notes from approver

/recurringShifts
  /{recurringShiftId}          // Auto-generated document ID
    name: string               // "Weekend Patrol"
    description: string        // Description of recurring shift
    pattern: string            // "weekly", "biweekly", "monthly"
    daysOfWeek: array          // [0, 6] (Sunday and Saturday)
    startTime: string          // "08:00"
    endTime: string            // "20:00"
    teamId: string             // Team this applies to
    roles: array               // Roles needed for each occurrence
    active: boolean            // Whether this pattern is active
    createdBy: string          // Who created this pattern
    createdAt: timestamp
    nextGenerationDate: timestamp // When to generate next set of shifts

/shiftTemplates
  /{templateId}                // Auto-generated document ID
    name: string               // "Standard Patrol Shift"
    description: string        // Template description
    duration: number           // Length in hours
    requiredRoles: array       // Roles needed
    defaultLocation: {         // Default location data
      name: string
      coordinates: object
    }
    createdBy: string
    createdAt: timestamp
    updatedAt: timestamp



# Querying Examples

    // Get all shifts for a particular day
const shiftsRef = firebase.firestore().collection('shifts');
const dayStart = new Date('2025-04-01T00:00:00Z');
const dayEnd = new Date('2025-04-01T23:59:59Z');

const shiftsQuery = shiftsRef
  .where('startTime', '>=', dayStart)
  .where('startTime', '<=', dayEnd)
  .get();

// Get a user's availability for a specific month
const userScheduleRef = firebase.firestore()
  .collection('schedules')
  .doc(userId);

userScheduleRef.get().then(doc => {
  if (doc.exists) {
    const availability = doc.data().availability;
    // Filter for dates in April 2025
    const aprilDates = Object.keys(availability)
      .filter(date => date.startsWith('2025-04-'));
  }
});

# Security Rules

match /schedules/{userId} {
  allow read: if request.auth.uid == userId || 
    hasRole('coordinator');
  allow write: if request.auth.uid == userId ||
    hasRole('coordinator');
}

# Batch Operations

const batch = firebase.firestore().batch();
// Add operations to batch
// Then commit
batch.commit();