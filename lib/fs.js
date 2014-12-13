var fs = require('fs');

var Promise = require('bluebird');

module.exports = Promise.promisifyAll(fs);
