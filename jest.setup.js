// Mock Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    fromDate: jest.fn(date => date.getTime()),
    now: jest.fn(() => Date.now()),
  },
  serverTimestamp: jest.fn(() => Date.now()),
  arrayUnion: jest.fn(data => data),
  writeBatch: jest.fn(() => ({
    update: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
  })),
  GeoPoint: jest.fn(function (latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }),
}));
