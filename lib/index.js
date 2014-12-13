var assert = require('assert');
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var getEnv = require('get-env');
var Promise = require('bluebird');
var yaml = require('js-yaml');

Promise.promisifyAll(fs);

function _exists(path) {
  return new Promise(function (resolve) {
    fs.exists(path, resolve);
  });
}

function _isDirectory(path) {
  return fs.lstatAsync(path)
    .then(function (stats) {
      return stats.isDirectory();
    });
}

function _isFile(path) {
  return fs.lstatAsync(path)
    .then(function (stats) {
      return stats.isFile();
    });
}

function _loadJSONFile(path) {
  return fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return JSON.parse(content);
    });
}

function _loadYAMLFile(path) {
  return fs.readFileAsync(path, 'utf8')
    .then(function (content) {
      return yaml.safeLoad(content);
    });
}

function _loadDir(dir) {
  var result = {};
  return Promise.resolve()
    .then(function () {
      return fs.readdirAsync(dir);
    })
    .then(function (files) {
      var filesByExtName = {};
      var extname;
      files.forEach(function (file) {
        extname = path.extname(file);
        if (!_.has(filesByExtName, extname)) {
          filesByExtName[extname] = [];
        }
        filesByExtName[extname].push(file);
      });
      return filesByExtName;
    })
    .then(function (filesByExtName) {
      var loadTasks = [];
      _.merge([], filesByExtName['.json']).forEach(function (file) {
        loadTasks.push({
          filepath: path.join(dir, file),
          fn: _loadJSONFile
        });
      });
      _.merge([], filesByExtName['.yml'], filesByExtName['.yaml']).forEach(function (file) {
        loadTasks.push({
          filepath: path.join(dir, file),
          fn: _loadYAMLFile
        });
      });
      return loadTasks;
    })
    .map(function (loadTask) {
      return _exists(loadTask.filepath)
        .then(function (exists) {
          if (!exists) {return;}
          return _isFile(loadTask.filepath)
            .then(function (isFile) {
              if (!isFile) {return;}
              return Promise.resolve()
                .then(function () {
                  return loadTask.fn(loadTask.filepath);
                })
                .then(function (loaded) {
                  var extname = path.extname(loadTask.filepath);
                  result[path.basename(loadTask.filepath, extname)] = loaded;
                })
                .catch(function (err) {
                  console.error('Failed to load file: ' + loadTask.filepath);
                  throw err;
                });
            });
        });
    })
    .then(function () {
      return result;
    });
}

function getConfig(configDir, env, cb) {
  var config = {};
  var hasOverrideDir = false;
  var overrideDir;

  if (_.isFunction(env)) {
    cb = env;
    env = void 0;
  }

  assert(_.isString(configDir) && !_.isEmpty(configDir),
    '"configDir" should be a string path to a directory.');
  assert((_.isString(env) && !_.isEmpty(env)) || _.isUndefined(env),
    '"env" should be either a non-empty string or undefined.');
  assert(_.isFunction(cb) || _.isUndefined(cb),
    '"cb" should be either a callback function or undefined.');

  env = env || getEnv();
  overrideDir = path.join(configDir, env);

  return Promise.resolve()
    .then(function () {
      return _exists(configDir);
    })
    .then(function (exists) {
      assert(exists, '"configDir" does not exist: ' + configDir);
      return _isDirectory(configDir);
    })
    .then(function (isDirectory) {
      if (!isDirectory) {
        throw new Error('"configDir" should be a string path to a directory: ' + configDir);
      }
    })
    .then(function () {
      return _exists(overrideDir);
    })
    .then(function (exists) {
      if (!exists) {return;}
      return _isDirectory(overrideDir)
        .then(function (isDirectory) {
          hasOverrideDir = isDirectory;
        });
    })
    .then(function () {
      var promises = [_loadDir(configDir)];
      if (hasOverrideDir) {
        promises.push(_loadDir(overrideDir));
      }
      return Promise.all(promises);
    })
    .spread(function (config, configOverride) {
      return _.merge(config, configOverride);
    })
    .nodeify(cb);
}

module.exports = getConfig;
