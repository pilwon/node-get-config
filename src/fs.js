const fs = require('fs');

const Promise = require('bluebird');

module.exports = Promise.promisifyAll(fs);
