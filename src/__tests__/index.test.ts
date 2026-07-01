import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('formatFile', () => {
  let tmpDir: string;
  let originalCwd: string;
  let stdoutWrite: typeof process.stdout.write;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dbsqlfmt-test-'));
    originalCwd = process.cwd();
    process.chdir(tmpDir);
    stdoutWrite = process.stdout.write;
    process.stdout.write = () => true;
  });

  afterEach(() => {
    process.chdir(originalCwd);
    process.stdout.write = stdoutWrite;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('格式化并写入文件', async () => {
    const { formatFile } = await import('../index');
    const fp = path.join(tmpDir, 'test.sql');
    fs.writeFileSync(fp, 'select id from users', 'utf-8');
    formatFile(fp, { language: 'mysql', uppercase: true });
    const content = fs.readFileSync(fp, 'utf-8');
    expect(content).toContain('SELECT');
    expect(content).toContain('ID');
  });

  it('dryRun 模式不修改文件', async () => {
    const { formatFile } = await import('../index');
    const fp = path.join(tmpDir, 'test.sql');
    fs.writeFileSync(fp, 'select id from users', 'utf-8');
    formatFile(fp, { language: 'mysql', dryRun: true });
    expect(fs.readFileSync(fp, 'utf-8')).toBe('select id from users');
  });

  it('不存在的文件抛错', async () => {
    const { formatFile } = await import('../index');
    const fp = path.join(tmpDir, 'nope.sql');
    expect(() => formatFile(fp, {})).toThrow(/not found|ENOENT/i);
  });

  it('自动检测方言并格式化', async () => {
    const { formatFile } = await import('../index');
    const fp = path.join(tmpDir, 'test.sql');
    fs.writeFileSync(fp, 'select id::text from users', 'utf-8');
    formatFile(fp, {});
    const content = fs.readFileSync(fp, 'utf-8');
    expect(content).toContain('ID');
  });

  it('uppercase 选项生效', async () => {
    const { formatFile } = await import('../index');
    const fp = path.join(tmpDir, 'test.sql');
    fs.writeFileSync(fp, 'select id from users', 'utf-8');
    formatFile(fp, { uppercase: true });
    const content = fs.readFileSync(fp, 'utf-8');
    expect(content).toContain('SELECT');
    expect(content).not.toContain('select');
  });
});
