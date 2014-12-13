var _fs = require('../fs');

module.exports = function (path) {
  var toml = require('toml');

  return _fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return toml.parse(content);
    });
};

