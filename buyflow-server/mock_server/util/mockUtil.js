const fs = require('fs');

// globals
const __mockDir = 'mock_server/mocks/';

exports.readMock = function(mockName, done) {
  fs.readFile(__mockDir + mockName, 'utf8', function (err, data) {
    if (err) throw err;
    const res = JSON.parse(data);

    done(res);
  });
};

exports.readMockSync = function(mockName) {
  return JSON.parse(fs.readFileSync(__mockDir + mockName, 'utf8'));
};

exports.ArrayLoop = class {
  constructor(arrayToLoopThrough) {
    this.array = arrayToLoopThrough;
    this.index = 0;
    this.lastIndex = arrayToLoopThrough.length - 1;
  }

  currentValue() {
    return this.array[this.index];
  }

  nextIndex() {
    this.index = this.index < this.lastIndex ? this.index + 1 : 0;
		return this;
  }
};
