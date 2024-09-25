module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    },
    moduleNameMapper: {
      '\\.(css|less)$': '<rootDir>/src/__mocks__/ModalCrearPartidaStyleMock.jsx',
      '\\.(css|less)$': '<rootDir>/src/__mocks__/SuccessAlertStyleMock.jsx'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom'
  };