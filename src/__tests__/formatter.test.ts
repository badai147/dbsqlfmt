import { describe, it, expect } from 'vitest';
import { formatSql } from '../formatter';

describe('formatSql', () => {
  it('显式指定 mysql 语言', () => {
    const result = formatSql('select id from users', { language: 'mysql' });
    expect(result).toBeTypeOf('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('显式指定 postgresql 语言', () => {
    const result = formatSql('select id from users', { language: 'postgresql' });
    expect(result).toBeTypeOf('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('不传 language 时自动检测 MySQL（反引号触发）', () => {
    const result = formatSql('select `id`, `name` from `users`');
    expect(result).toContain('id');
    expect(result).toContain('users');
  });

  it('不传 language 时自动检测 PostgreSQL（:: 触发）', () => {
    const result = formatSql('select id::text from users');
    expect(result).toContain('ID');
  });

  it('默认关键字大写', () => {
    const result = formatSql('select id from users');
    expect(result).toContain('SELECT');
    expect(result).not.toContain('select');
  });

  it('keywordCase: lower 转小写', () => {
    const result = formatSql('SELECT ID FROM USERS', { keywordCase: 'lower' });
    expect(result).toContain('select');
    expect(result).not.toContain('SELECT');
  });

  it('keywordCase: preserve 保留原样', () => {
    const result = formatSql('select id from users', { keywordCase: 'preserve' });
    expect(result).toContain('select');
  });

  it('keywordCase: upper 转大写', () => {
    const result = formatSql('select id from users', { keywordCase: 'upper' });
    expect(result).toContain('SELECT');
    expect(result).not.toContain('select');
  });

  it('uppercase 向后兼容', () => {
    const result = formatSql('select id from users', { uppercase: true });
    expect(result).toContain('SELECT');
  });

  it('keywordCase 优先于 uppercase', () => {
    const result = formatSql('SELECT ID FROM USERS', { uppercase: true, keywordCase: 'lower' });
    expect(result).toContain('select');
  });

  it('dataTypeCase: lower 转小写数据类型', () => {
    const result = formatSql('SELECT CAST(id AS INT)', { dataTypeCase: 'lower' });
    expect(result).toContain('int');
  });

  it('functionCase: lower 转小写函数名', () => {
    const result = formatSql('SELECT COUNT(*) FROM users', { functionCase: 'lower' });
    expect(result).toContain('count(*)');
  });

  it('identifierCase: upper 转大写标识符', () => {
    const result = formatSql('select id from users', { identifierCase: 'upper', keywordCase: 'preserve' });
    expect(result).toContain('ID');
    expect(result).toContain('USERS');
  });

  it('indent 选项控制缩进', () => {
    const result = formatSql('select id, name from users where id > 0', { indent: '4' });
    expect(result).toBeTypeOf('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('复杂 MySQL 格式化端到端', () => {
    const sql = [
      'select u.id,',
      '  u.name,',
      "  o.status",
      'from `users` u',
      '  join `orders` o on u.id = o.user_id',
      "where o.status = 'active' and u.id > 100",
      'order by u.name asc',
      'limit 10',
    ].join('\n');
    const result = formatSql(sql, { indent: '2' });
    expect(result).toBeTypeOf('string');
  });

  it('复杂 PostgreSQL 格式化端到端', () => {
    const sql = [
      'WITH updated AS (',
      '  UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name::text',
      ')',
      'SELECT * FROM updated',
    ].join('\n');
    const result = formatSql(sql, { indent: '2' });
    expect(result).toBeTypeOf('string');
  });
});
