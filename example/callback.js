// var getConfig = require('get-config');
var getConfig = require('../');

getConfig(__dirname + '/config', function (err, config) {
  if (err) {
    return console.error(err.message);
  }

  // Result:
  //   config.client.hello ==> 'dude' for dev, 'world' otherwise
  //   config.server.host  ==> 'prod-server' for prod, 'localhost' otherwise
  //   config.server.port  ==> 12345 for all environments
  console.log(config);
});
