const _fs = require('../fs');

module.exports = (path) => {
  return _fs.readFileAsync(path, 'utf8')
    .then(content => JSON.parse(content));
};
