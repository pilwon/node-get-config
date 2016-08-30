const _fs = require('../fs');

module.exports = (path) => {
  let xml2json;

  try {
    xml2json = require('xml2json');
  } catch(err) {
    console.error('Please install XML parser: `npm install xml2json`');
    process.exit(err.code);
  }

  return _fs.readFileAsync(path, 'utf8')
    .then(content => xml2json.toJson(content, {object: true}));
};
