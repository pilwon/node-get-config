// var getConfig = require('get-config');
var getConfig = require('../');

var config = getConfig.sync(__dirname + '/config');

// Result:
//   config.client.hello ==> 'dude' for dev, 'world' otherwise
//   config.server.host  ==> 'prod-server' for prod, 'localhost' otherwise
//   config.server.port  ==> 12345 for all environments
//   config.test.foo     ==> 'bar' only for dev
console.log(config);
