import * as assert from 'assert';
import * as path from 'path';

import { isEmpty, isFunction, isString, isUndefined, merge } from 'lodash';
const getEnv = require('get-env');

import { exists, existsSync, isDir, isDirSync, isFile, isFileSync, readDir, readDirSync } from './fs';
import { load as loadINI, loadSync as loadSyncINI } from './loaders/ini';
import { load as loadJS, loadSync as loadSyncJS } from './loaders/js';
import { load as loadJSON, loadSync as loadSyncJSON } from './loaders/json';
import { load as loadTOML, loadSync as loadSyncTOML } from './loaders/toml';
import { load as loadXML, loadSync as loadSyncXML } from './loaders/xml';
import { load as loadYAML, loadSync as loadSyncYAML } from './loaders/yaml';

const OVERRIDE_DIR = '_override';

function _buildLoadTasks(dir: string, files: string[]) {
  const result: {filepath: string, fn: (path: string) => Promise<any>, fnSync: (path: string) => any}[] = [];

  const filesByExtName = files.reduce((out: {[id: string]: string[]}, file: string) => {
    const extname = path.extname(file).toLowerCase();
    if (!(extname in out)) {
      out[extname] = [];
    }
    out[extname].push(file);
    return out;
  }, {});

  merge([], filesByExtName['.ini'], filesByExtName['.cfg'], filesByExtName['.conf']).forEach((file: string) => {
    result.push({filepath: path.resolve(dir, file), fn: loadINI, fnSync: loadSyncINI});
  });

  merge([], filesByExtName['.js']).forEach((file: string) => {
    result.push({filepath: path.resolve(dir, file), fn: loadJS, fnSync: loadSyncJS});
  });

  merge([], filesByExtName['.json']).forEach((file: string) => {
    result.push({filepath: path.resolve(dir, file), fn: loadJSON, fnSync: loadSyncJSON});
  });

  merge([], filesByExtName['.toml']).forEach((file: string) => {
    result.push({filepath: path.resolve(dir, file), fn: loadTOML, fnSync: loadSyncTOML});
  });

  merge([], filesByExtName['.xml']).forEach((file: string) => {
    result.push({filepath: path.resolve(dir, file), fn: loadXML, fnSync: loadSyncXML});
  });

  merge([], filesByExtName['.yaml'], filesByExtName['.yml']).forEach((file: string) => {
    result.push({filepath: path.resolve(dir, file), fn: loadYAML, fnSync: loadSyncYAML});
  });

  return result;
}

async function _loadDir(dir: string): Promise<{}> {
  const loadTasks = _buildLoadTasks(dir, await readDir(dir));
  const result: {[id: string]: any} = {};

  for (const task of loadTasks) {
    try {
      if (await isFile(task.filepath)) {
        const loaded = await task.fn(task.filepath);
        const extname = path.extname(task.filepath).toLowerCase();
        const key = path.basename(task.filepath, extname);
        result[key] = isFunction(loaded) ? loaded : merge({}, result[key], loaded);
      }
    } catch (err) {
      console.error(`Failed to load file: ${task.filepath}`);
      throw err;
    }
  }

  return result;
}

function _loadDirSync(dir: string) {
  const loadTasks = _buildLoadTasks(dir, readDirSync(dir));
  const result: {[id: string]: any} = {};

  for (const task of loadTasks) {
    try {
      if (isFileSync(task.filepath)) {
        const loaded = task.fnSync(task.filepath);
        const extname = path.extname(task.filepath).toLowerCase();
        const key = path.basename(task.filepath, extname);
        result[key] = isFunction(loaded) ? loaded : merge({}, result[key], loaded);
      }
    } catch (err) {
      console.error(`Failed to load file: ${task.filepath}`);
      throw err;
    }
  }

  return result;
}

function _setup(configDir: string, env: string, cb: Function = undefined) {
  assert(isString(configDir) && !isEmpty(configDir),
    '"configDir" should be a string path to a directory.');
  assert((isString(env) && !isEmpty(env)) || isUndefined(env),
    '"env" should be either a non-empty string or undefined.');
  assert(isFunction(cb) || isUndefined(cb),
    '"cb" should be either a callback function or undefined.');

  return {
    envDir: path.resolve(configDir, env || getEnv()),
    overrideDir: path.resolve(configDir, OVERRIDE_DIR),
  };
}

async function _load(configDir: string, envDir: string, overrideDir: string): Promise<any> {
  assert(await exists(configDir) && await isDir(configDir),
    `"configDir" should be a directory path: ${configDir}`);

  const results = [await _loadDir(configDir)];
  if (await exists(envDir) && await isDir(envDir)) {
    results.push(await _loadDir(envDir));
  }
  if (await exists(overrideDir) && await isDir(overrideDir)) {
    results.push(await _loadDir(overrideDir));
  }
  return merge.apply(null, results);
}

export function load(configDir: string, env?: string): Promise<any>;
export function load(configDir: string, callback: (err: Error, config: any) => void): void;
export function load(configDir: string, env: string, callback: (err: Error, config: any) => void): void;
export function load(configDir: string, env?: any, callback?: any) {
  if (isFunction(env)) {
    callback = <Function> env;
    env = void 0;
  }

  const { envDir, overrideDir } = _setup(configDir, <string> env, callback);

  if (isFunction(callback)) {
    return _load(configDir, envDir, overrideDir)
      .then(result => callback(null, result))
      .catch(err => callback(err));
  }
  return _load(configDir, envDir, overrideDir);
}

export function loadSync(configDir: string, env?: string): any {
  const { envDir, overrideDir } = _setup(configDir, env);

  assert(existsSync(configDir) && isDirSync(configDir),
    `"configDir" should be a directory path: ${configDir}`);

  const results = [_loadDirSync(configDir)];
  if (existsSync(envDir) && isDirSync(envDir)) {
    results.push(_loadDirSync(envDir));
  }
  if (existsSync(overrideDir) && isDirSync(overrideDir)) {
    results.push(_loadDirSync(overrideDir));
  }
  return merge.apply(null, results);
}
