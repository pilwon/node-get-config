var _fs = require('../fs');

module.exports = function (path) {
  return _fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return JSON.parse(content);
    });
};
