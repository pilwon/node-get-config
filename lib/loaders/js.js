var Promise = require('bluebird');

module.exports = function (path) {
  return Promise.resolve(require(path));
};
