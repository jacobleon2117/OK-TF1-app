module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@utils': './src/utils',
            '@assets': './assets',
            '@env': './src/env.ts',
          },
        },
      ],
      'module:react-native-dotenv',
      'react-native-reanimated/plugin',
    ],
  };
};