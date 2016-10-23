import { readFile, readFileSync } from '../fs';

export async function load(path: string) {
  const content = await readFile(path, {encoding: 'utf8'});
  return JSON.parse(content.toString());
}

export function loadSync(path: string) {
  const content = readFileSync(path, {encoding: 'utf8'});
  return JSON.parse(content);
}
