module.exports = {
  name: 'OK-TF1-app',
  slug: 'OK-TF1-app',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  plugins: [
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'This app needs access to your location to show it on the map.',
      },
    ],
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.jleon2117.OKTF1app',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'This app needs access to your location to show it on the map.',
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#000000',
    },
    permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
    package: 'com.jleon2117.OKTF1app',
  },
  extra: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  },
};
