module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^lucide-react-native/icons/.+$': '<rootDir>/test-utils/IconMock.tsx',
  },
};
