var _fs = require('../fs');

module.exports = function (path) {
  var yaml = require('js-yaml');

  return _fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return yaml.safeLoad(content);
    });
};
