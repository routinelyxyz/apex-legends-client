module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  "moduleNameMapper": {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy"
  },
  "testPathIgnorePatterns": ["/node_modules/", "/cypress/", "/cache/"],
  // "globals": {
  //   "ts-jest": {
  //     "babelConfig": true,
  //     "tsConfig": "tsconfig.json"
  //   }
  // }
};