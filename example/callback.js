// const getConfig = require('get-config');
const getConfig = require('../');

getConfig(`${__dirname}/config`, (err, config) => {
  if (err) {
    return console.error(err.message);
  }

  // Result:
  //   config.client.hello ==> 'dude' for dev, 'world' otherwise
  //   config.server.host  ==> 'prod-server' for prod, 'localhost' otherwise
  //   config.server.port  ==> 12345 for all environments
  //   config.test.foo     ==> 'bar' only for dev
  //   config.test.test    ==> 'test' only for dev
  console.log(config);
});
