const assert = require('assert');
const path = require('path');
const url = require('url');

const Promise = require('bluebird');
const isEmpty = require('lodash.isempty');
const isFunction = require('lodash.isfunction');
const isString = require('lodash.isstring');
const isUndefined = require('lodash.isundefined');
const merge = require('lodash.merge');
const getEnv = require('get-env');

const _loaders = {
  ini: require('./loaders/ini'),
  js: require('./loaders/js'),
  json: require('./loaders/json'),
  toml: require('./loaders/toml'),
  xml: require('./loaders/xml'),
  yaml: require('./loaders/yaml')
};

const _fs = require('./fs');

const DEFAULT_OVERRIDE_DIR = '_override';

function _exists(path) {
  return new Promise(resolve => _fs.exists(path, resolve));
}

function _isDirectory(path) {
  return _fs.lstatAsync(path)
    .then(stats => stats.isDirectory());
}

function _isFile(path) {
  return _fs.lstatAsync(path)
    .then(stats => stats.isFile());
}

function _loadDir(dir) {
  const result = {};
  return _fs.readdirAsync(dir)
    .then((files) => {
      return files.reduce((filesByExtName, file) => {
        const extname = path.extname(file).toLowerCase();
        if (!(extname in filesByExtName)) {
          filesByExtName[extname] = [];
        }
        filesByExtName[extname].push(file);
        return filesByExtName;
      }, {});
    })
    .then((filesByExtName) => {
      const loadTasks = [];
      merge([], filesByExtName['.ini'], filesByExtName['.cfg'], filesByExtName['.conf']).forEach((file) => {
        loadTasks.push({
          filepath: path.resolve(dir, file),
          fn: _loaders.ini
        });
      });
      merge([], filesByExtName['.js']).forEach((file) => {
        loadTasks.push({
          filepath: path.resolve(dir, file),
          fn: _loaders.js
        });
      });
      merge([], filesByExtName['.json']).forEach((file) => {
        loadTasks.push({
          filepath: path.resolve(dir, file),
          fn: _loaders.json
        });
      });
      merge([], filesByExtName['.toml']).forEach((file) => {
        loadTasks.push({
          filepath: path.resolve(dir, file),
          fn: _loaders.toml
        });
      });
      merge([], filesByExtName['.xml']).forEach((file) => {
        loadTasks.push({
          filepath: path.resolve(dir, file),
          fn: _loaders.xml
        });
      });
      merge([], filesByExtName['.yaml'], filesByExtName['.yml']).forEach((file) => {
        loadTasks.push({
          filepath: path.resolve(dir, file),
          fn: _loaders.yaml
        });
      });
      return loadTasks;
    })
    .map((loadTask) => {
      return _exists(loadTask.filepath)
        .then((exists) => {
          if (!exists) {return;}
          return _isFile(loadTask.filepath);
        })
        .then((isFile) => {
          if (!isFile) {return;}
          return loadTask.fn(loadTask.filepath);
        })
        .then((loaded) => {
          const extname = path.extname(loadTask.filepath).toLowerCase();
          const key = path.basename(loadTask.filepath, extname);
          result[key] = isFunction(loaded) ? loaded : merge({}, result[key], loaded);
        })
        .catch((err) => {
          console.error('Failed to load file: ' + loadTask.filepath);
          throw err;
        });
    })
    .then(() => result);
}

exports = module.exports = (configDir, env, cb) => {
  const config = {};
  const overrideDir = path.resolve(configDir, exports.OVERRIDE_DIR);

  let envDir;
  let hasEnvDir = false;
  let hasOverrideDir = false;

  if (isFunction(env)) {
    cb = env;
    env = void 0;
  }

  assert(isString(configDir) && !isEmpty(configDir),
    '"configDir" should be a string path to a directory.');
  assert((isString(env) && !isEmpty(env)) || isUndefined(env),
    '"env" should be either a non-empty string or undefined.');
  assert(isFunction(cb) || isUndefined(cb),
    '"cb" should be either a callback function or undefined.');

  env = env || getEnv();
  envDir = path.resolve(configDir, env);

  return _exists(configDir)
    .then((exists) => {
      assert(exists, '"configDir" does not exist: ' + configDir);
      return _isDirectory(configDir);
    })
    .then((isDirectory) => {
      assert(isDirectory, '"configDir" should be a string path to a directory: ' + configDir);
    })
    .then(() => {
      return _exists(envDir)
        .then((exists) => {
          if (!exists) {return;}
          return _isDirectory(envDir)
            .then((isDirectory) => {
              hasEnvDir = isDirectory;
            });
        });
    })
    .then(() => {
      return _exists(overrideDir)
        .then((exists) => {
          if (!exists) {return;}
          return _isDirectory(overrideDir)
            .then((isDirectory) => {
              hasOverrideDir = isDirectory;
            });
        });
    })
    .then(() => {
      const promises = [_loadDir(configDir)];
      if (hasEnvDir) {
        promises.push(_loadDir(envDir));
      }
      if (hasOverrideDir) {
        promises.push(_loadDir(overrideDir));
      }
      return Promise.all(promises);
    })
    .spread(merge)
    .nodeify(cb);
};

exports.OVERRIDE_DIR = DEFAULT_OVERRIDE_DIR;
