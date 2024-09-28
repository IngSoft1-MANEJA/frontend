module.exports = {
    // testEnvironment: 'jest-environment-jsdom',
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironmentOptions: {
        customExportConditions: [''],
      },
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    },
    moduleNameMapper: {
      '\\.(css|less)$': '<rootDir>/src/__mocks__/ModalCrearPartidaStyleMock.jsx',
      '\\.(css|less)$': '<rootDir>/src/__mocks__/SuccessAlertStyleMock.jsx'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleFileExtensions: ["js", "jsx"],
    testEnvironment: 'jest-fixed-jsdom'
}