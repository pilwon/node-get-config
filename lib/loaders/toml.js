var _fs = require('../fs');

module.exports = function (path) {
  var toml;

  try {
    toml = require('toml');
  } catch(err) {
    console.error('Please install TOML parser: `npm install toml --save`');
    process.exit(err.code);
  }

  return _fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return toml.parse(content);
    });
};

