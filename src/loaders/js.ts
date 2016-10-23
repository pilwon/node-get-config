export async function load(path: string) {
  return require(path);
}

export function loadSync(path: string) {
  return require(path);
}
