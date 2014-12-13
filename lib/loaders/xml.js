var _fs = require('../fs');

module.exports = function (path) {
  var xml2json = require('xml2json');

  return _fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      console.log(xml2json.toJson(content));
      return xml2json.toJson(content);
    });
};
