var _fs = require('../fs');

module.exports = function (path) {
  var ini = require('ini');

  return _fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return ini.parse(content);
    });
};
