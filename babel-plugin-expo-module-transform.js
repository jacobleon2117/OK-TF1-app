// babel-plugin-expo-module-transform.js
module.exports = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        if (source.startsWith('expo-modules-core')) {
          path.remove();
        }
      },
    },
  };
};
