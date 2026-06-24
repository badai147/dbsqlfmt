import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('readFile', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dbsqlfmt-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('读取普通文件', async () => {
    const { readFile } = await import('../utils');
    const fp = path.join(tmpDir, 'test.sql');
    fs.writeFileSync(fp, 'SELECT 1', 'utf-8');
    expect(readFile(fp)).toBe('SELECT 1');
  });

  it('不存在的文件抛错', async () => {
    const { readFile } = await import('../utils');
    const fp = path.join(tmpDir, 'nope.sql');
    expect(() => readFile(fp)).toThrow(/not found|ENOENT/i);
  });

  it('目录路径抛错', async () => {
    const { readFile } = await import('../utils');
    expect(() => readFile(tmpDir)).toThrow('Not a file');
  });

  it('超大文件抛错', async () => {
    const { readFile } = await import('../utils');
    const fp = path.join(tmpDir, 'huge.sql');
    const buf = Buffer.alloc(101 * 1024 * 1024, 'x');
    fs.writeFileSync(fp, buf.toString());
    expect(() => readFile(fp)).toThrow('too large');
  });
});

describe('writeFile', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dbsqlfmt-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('写入文件内容', async () => {
    const { writeFile } = await import('../utils');
    const fp = path.join(tmpDir, 'out.sql');
    writeFile(fp, 'SELECT 1');
    expect(fs.readFileSync(fp, 'utf-8')).toBe('SELECT 1');
  });

  it('拒绝写入符号链接', async () => {
    const { writeFile } = await import('../utils');
    const target = path.join(tmpDir, 'target.txt');
    const link = path.join(tmpDir, 'link.sql');
    fs.writeFileSync(target, 'original', 'utf-8');
    try {
      fs.symlinkSync(target, link);
    } catch {
      // Windows 可能需管理员权限创建符号链接，跳过
      return;
    }
    expect(() => writeFile(link, 'new content')).toThrow('symlink');
  });
});
