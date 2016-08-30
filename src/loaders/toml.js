const _fs = require('../fs');

module.exports = (path) => {
  let toml;

  try {
    toml = require('toml');
  } catch(err) {
    console.error('Please install TOML parser: `npm install toml`');
    process.exit(err.code);
  }

  return _fs.readFileAsync(path, 'utf8')
    .then(content => toml.parse(content));
};

