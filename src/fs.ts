import * as fs from 'fs';

export async function exists(path: string): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    fs.access(path, err => resolve(!err || err.code !== 'ENOENT'));
  });
}

export const existsSync = fs.existsSync;

export async function isDir(path: string): Promise<boolean> {
  return lstat(path).then(stats => stats.isDirectory());
}

export function isDirSync(path: string): boolean {
  return lstatSync(path).isDirectory();
}

export async function isFile(path: string): Promise<boolean> {
  return lstat(path).then(stats => stats.isFile());
}

export function isFileSync(path: string): boolean {
  return lstatSync(path).isFile();
}

export async function lstat(path: string): Promise<fs.Stats> {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.lstat(path, (err, stats) => {
      if (err) {
        return reject(err);
      }
      resolve(stats);
    });
  });
}

export const lstatSync = fs.lstatSync;

export async function readDir(path: string, options?: {encoding: string}): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const fn: any = fs.readdir;
    fn(path, options, (err: Error, files: string[]) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
}

export const readDirSync = fs.readdirSync;

export async function readFile(path: string, options?: {}): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

export const readFileSync = fs.readFileSync;
