import { readFile, readFileSync } from '../fs';

export async function load(path: string) {
  let yaml: any;
  try {
    yaml = require('js-yaml');
  } catch (err) {
    throw new Error('Please install YAML parser: `npm install js-yaml`');
  }
  const content = await readFile(path, {encoding: 'utf8'});
  return yaml.safeLoad(content);
}

export function loadSync(path: string) {
  let yaml: any;
  try {
    yaml = require('js-yaml');
  } catch (err) {
    throw new Error('Please install YAML parser: `npm install js-yaml`');
  }
  const content = readFileSync(path, {encoding: 'utf8'});
  return yaml.safeLoad(content);
}
