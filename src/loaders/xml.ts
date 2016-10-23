import { readFile, readFileSync } from '../fs';

export async function load(path: string) {
  let xml2json: any;
  try {
    xml2json = require('xml2json');
  } catch (err) {
    throw new Error('Please install XML parser: `npm install xml2json`');
  }
  const content = await readFile(path, {encoding: 'utf8'});
  return xml2json.toJson(content, {object: true});
}

export function loadSync(path: string) {
  let xml2json: any;
  try {
    xml2json = require('xml2json');
  } catch (err) {
    throw new Error('Please install XML parser: `npm install xml2json`');
  }
  const content = readFileSync(path, {encoding: 'utf8'});
  return xml2json.toJson(content, {object: true});
}
