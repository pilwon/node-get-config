var _fs = require('../fs');

module.exports = function (path) {
  var xml2json;

  try {
    xml2json = require('xml2json');
  } catch(err) {
    console.error('Please install XML parser: `npm install xml2json`');
    process.exit(err.code);
  }

  return _fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return xml2json.toJson(content);
    });
};
