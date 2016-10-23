const { readFile, readFileSync } = require('../fs');

export async function load(path: string) {
  let toml: any;
  try {
    toml = require('toml');
  } catch (err) {
    throw new Error('Please install TOML parser: `npm install toml`');
  }
  const content = await readFile(path, {encoding: 'utf8'});
  return toml.parse(content);
}

export function loadSync(path: string) {
  let toml: any;
  try {
    toml = require('toml');
  } catch (err) {
    throw new Error('Please install TOML parser: `npm install toml`');
  }
  const content = readFileSync(path, {encoding: 'utf8'});
  return toml.parse(content);
}
