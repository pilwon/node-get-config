var _fs = require('../fs');

module.exports = function (path) {
  var ini;

  try {
    ini = require('ini');
  } catch(err) {
    console.error('Please install INI parser: `npm install ini`');
    process.exit(err.code);
  }

  return _fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return ini.parse(content);
    });
};
