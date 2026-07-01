import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('mergeConfig', () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dbsqlfmt-test-'));
    originalCwd = process.cwd();
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('没有配置文件时返回 CLI 选项', async () => {
    const { mergeConfig } = await import('../config');
    const result = mergeConfig({ language: 'mysql' });
    expect(result).toEqual({ language: 'mysql' });
  });

  it('CLI 选项覆盖配置文件', async () => {
    const { mergeConfig } = await import('../config');
    fs.writeFileSync(
      path.join(tmpDir, '.dbsqlfmtrc'),
      JSON.stringify({ language: 'postgresql', indent: '4' }),
      'utf-8'
    );
    const result = mergeConfig({ language: 'mysql' });
    expect(result).toEqual({ language: 'mysql', indent: '4' });
  });

  it('CLI undefined 值不覆盖配置', async () => {
    const { mergeConfig } = await import('../config');
    fs.writeFileSync(
      path.join(tmpDir, '.dbsqlfmtrc'),
      JSON.stringify({ indent: '8' }),
      'utf-8'
    );
    const result = mergeConfig({ language: 'mysql', indent: undefined });
    expect(result).toEqual({ language: 'mysql', indent: '8' });
  });

  it('配置文件中无关键被过滤', async () => {
    const { mergeConfig } = await import('../config');
    fs.writeFileSync(
      path.join(tmpDir, '.dbsqlfmtrc'),
      JSON.stringify({ language: 'mysql', secret: 'hunter2' }),
      'utf-8'
    );
    const result = mergeConfig({});
    expect(result).toEqual({ language: 'mysql' });
    expect((result as Record<string, unknown>).secret).toBeUndefined();
  });

  it('配置文件中新 case 选项生效', async () => {
    const { mergeConfig } = await import('../config');
    fs.writeFileSync(
      path.join(tmpDir, '.dbsqlfmtrc'),
      JSON.stringify({ keywordCase: 'lower', dataTypeCase: 'preserve', functionCase: 'upper', identifierCase: 'lower' }),
      'utf-8'
    );
    const result = mergeConfig({});
    expect(result).toEqual({ keywordCase: 'lower', dataTypeCase: 'preserve', functionCase: 'upper', identifierCase: 'lower' });
  });

  it('CLI case 选项覆盖配置文件', async () => {
    const { mergeConfig } = await import('../config');
    fs.writeFileSync(
      path.join(tmpDir, '.dbsqlfmtrc'),
      JSON.stringify({ keywordCase: 'upper', functionCase: 'upper' }),
      'utf-8'
    );
    const result = mergeConfig({ keywordCase: 'lower' });
    expect(result).toEqual({ keywordCase: 'lower', functionCase: 'upper' });
  });

  it('配置文件 JSON 无效时返回 {}', async () => {
    const { mergeConfig } = await import('../config');
    fs.writeFileSync(
      path.join(tmpDir, '.dbsqlfmtrc'),
      'not json',
      'utf-8'
    );
    const result = mergeConfig({ language: 'mysql' });
    expect(result).toEqual({ language: 'mysql' });
  });

  it('配置文件过大时抛错', async () => {
    const { mergeConfig } = await import('../config');
    const buf = Buffer.alloc(2 * 1024 * 1024, 'x');
    fs.writeFileSync(path.join(tmpDir, '.dbsqlfmtrc'), buf.toString());
    expect(() => mergeConfig({})).toThrow('Config file too large');
  });
});
