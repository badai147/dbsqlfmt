import fs from 'fs';
import path from 'path';

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export function readFile(filePath: string): string {
  const stat = fs.statSync(filePath, { throwIfNoEntry: false });
  if (!stat) throw new Error(`File not found: ${filePath}`);
  if (!stat.isFile()) throw new Error(`Not a file: ${filePath}`);
  if (stat.size > MAX_FILE_SIZE) {
    throw new Error(`File too large (${stat.size} bytes): ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function isSymlink(filePath: string): boolean {
  try {
    return fs.lstatSync(filePath).isSymbolicLink();
  } catch {
    return false;
  }
}

export function writeFile(filePath: string, content: string): void {
  if (isSymlink(filePath)) {
    throw new Error(`Refusing to write through symlink: ${filePath}`);
  }
  const tmpFile = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.tmp.${process.pid}`
  );
  try {
    fs.writeFileSync(tmpFile, content, 'utf-8');
    fs.copyFileSync(tmpFile, filePath);
  } finally {
    try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
  }
}

export function print(content: string): void {
  process.stdout.write(content);
}
