const Promise = require('bluebird');

module.exports = (path) => {
  return Promise.resolve(require(path));
};
