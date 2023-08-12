/* eslint-disable */
export default {
  displayName: 'store',

  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  testPathIgnorePatterns: ['stale'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/store',
  preset: '../../jest.preset.js',
};
