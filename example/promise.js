// const getConfig = require('get-config');
const getConfig = require('../');

// Result:
//   config.client.hello ==> 'dude' for dev, 'world' otherwise
//   config.server.host  ==> 'prod-server' for prod, 'localhost' otherwise
//   config.server.port  ==> 12345 for all
//   config.test.foo     ==> 'bar' for dev, empty otherwise
//   config.test.test    ==> 'test' for dev, empty otherwise
getConfig.load(`${__dirname}/config`)
  .then(config => console.log(config))
  .catch(err => console.error(err.message));
