// Tests are placed alongside files under test.
// This file does the following:
// 1. Sets the environment to 'production' so that
//    dev-specific babel config in .babelrc doesn't run.
// 2. Disables Webpack-specific features that Mocha doesn't understand.
// 3. Registers babel for transpiling our code for testing.

// This assures the .babelrc dev config (which includes
// hot module reloading code) doesn't apply for tests.
// process.env.NODE_ENV = 'production';
// process.env.NODE_ENV = 'test';

// Register babel so that it will transpile ES6 to ES5
// before our tests run.
require('babel-register')();
//require("babel-polyfill");
require("babel-jest");
