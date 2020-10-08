module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['spec'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json'
    }
  }
};