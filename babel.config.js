module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@utils': './src/utils',
            '@assets': './assets',
          },
        },
      ],
      'module:react-native-dotenv',
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: { node: 'current' },
              modules: 'commonjs',
            },
          ],
          'babel-preset-expo',
        ],
        plugins: [
          '@babel/plugin-transform-modules-commonjs',
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          [
            '@babel/plugin-transform-typescript',
            {
              allowDeclareFields: true,
              isTSX: true,
              allExtensions: true,
            },
          ],
        ],
      },
    },
  };
};
