/* eslint-disable */
export default {
  displayName: 'requests',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  setupFiles: ['jest-date-mock'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/requests',
  preset: '../../jest.preset.js',
};
