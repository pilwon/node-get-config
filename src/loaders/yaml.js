const _fs = require('../fs');

module.exports = (path) => {
  let yaml;

  try {
    yaml = require('js-yaml');
  } catch(err) {
    console.error('Please install YAML parser: `npm install js-yaml`');
    process.exit(err.code);
  }

  return _fs.readFileAsync(path, 'utf8')
    .then(content => yaml.safeLoad(content));
};
