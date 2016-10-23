import { readFile, readFileSync } from '../fs';

export async function load(path: string) {
  let ini: any;
  try {
    ini = require('ini');
  } catch (err) {
    throw new Error('Please install INI parser: `npm install ini`');
  }
  const content = await readFile(path, {encoding: 'utf8'});
  return ini.parse(content);
}

export function loadSync(path: string) {
  let ini: any;
  try {
    ini = require('ini');
  } catch (err) {
    throw new Error('Please install INI parser: `npm install ini`');
  }
  const content = readFileSync(path, {encoding: 'utf8'});
  return ini.parse(content);
}
