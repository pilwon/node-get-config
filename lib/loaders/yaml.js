var _fs = require('../fs');

module.exports = function (path) {
  var yaml;

  try {
    yaml = require('js-yaml');
  } catch(err) {
    console.error('Please install YAML parser: `npm install js-yaml`');
    process.exit(err.code);
  }

  return _fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return yaml.safeLoad(content);
    });
};
