// const getConfig = require('get-config');
const getConfig = require('../');

getConfig(`${__dirname}/config`).then((config) => {
  // Result:
  //   config.client.hello ==> 'dude' for dev, 'world' for prod
  //   config.server.host  ==> 'localhost' for dev, 'prod-server' for prod
  //   config.server.port  ==> 12345 for both dev and prod
  //   config.test.foo     ==> 'bar' only for dev, empty for prod
  //   config.test.test    ==> 'test' only for dev, empty for prod
  console.log(config);
});
