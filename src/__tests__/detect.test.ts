import { describe, it, expect } from 'vitest';
import { detectDialect } from '../detect';

describe('detectDialect', () => {
  describe('MySQL 模式匹配', () => {
    it('反引号标识符 → mysql', () => {
      expect(detectDialect('SELECT `id` FROM `users`')).toBe('mysql');
    });

    it('AUTO_INCREMENT → mysql', () => {
      expect(detectDialect('CREATE TABLE t (id INT AUTO_INCREMENT)')).toBe('mysql');
    });

    it('ON DUPLICATE KEY UPDATE → mysql', () => {
      expect(detectDialect("INSERT INTO t VALUES (1) ON DUPLICATE KEY UPDATE name='x'")).toBe('mysql');
    });

    it('ENGINE= → mysql', () => {
      expect(detectDialect('CREATE TABLE t (id INT) ENGINE=InnoDB')).toBe('mysql');
    });

    it('REPLACE INTO → mysql', () => {
      expect(detectDialect('REPLACE INTO t VALUES (1)')).toBe('mysql');
    });

    it('# 注释 → mysql', () => {
      expect(detectDialect('SELECT *\n# this is a comment\nFROM t')).toBe('mysql');
    });

    it('INT(n) → mysql', () => {
      expect(detectDialect('ALTER TABLE t MODIFY id INT(11)')).toBe('mysql');
    });

    it('UNSIGNED → mysql', () => {
      expect(detectDialect('id INT UNSIGNED NOT NULL')).toBe('mysql');
    });

    it('CHARACTER SET → mysql', () => {
      expect(detectDialect('CREATE TABLE t (name TEXT) CHARACTER SET utf8mb4')).toBe('mysql');
    });

    it('CHARSET → mysql', () => {
      expect(detectDialect('CREATE TABLE t (name TEXT) CHARSET=utf8')).toBe('mysql');
    });

    it('FULLTEXT → mysql', () => {
      expect(detectDialect('CREATE FULLTEXT INDEX idx ON posts(content)')).toBe('mysql');
    });

    it('SPATIAL → mysql', () => {
      expect(detectDialect('CREATE SPATIAL INDEX idx ON locations(coord)')).toBe('mysql');
    });

    it('ROW_FORMAT → mysql', () => {
      expect(detectDialect('CREATE TABLE t (id INT) ROW_FORMAT=DYNAMIC')).toBe('mysql');
    });

    it('LOCK TABLES → mysql', () => {
      expect(detectDialect('LOCK TABLES users WRITE')).toBe('mysql');
    });

    it('UNLOCK TABLES → mysql', () => {
      expect(detectDialect('UNLOCK TABLES')).toBe('mysql');
    });

    it('STRAIGHT_JOIN → mysql', () => {
      expect(detectDialect('SELECT * FROM t1 STRAIGHT_JOIN t2 ON t1.id=t2.id')).toBe('mysql');
    });

    it('SQL_CALC_FOUND_ROWS → mysql', () => {
      expect(detectDialect('SELECT SQL_CALC_FOUND_ROWS id FROM users')).toBe('mysql');
    });

    it('SHOW TABLES → mysql', () => {
      expect(detectDialect('SHOW TABLES')).toBe('mysql');
    });

    it('SHOW DATABASES → mysql', () => {
      expect(detectDialect('SHOW DATABASES')).toBe('mysql');
    });

    it('SHOW CREATE TABLE → mysql', () => {
      expect(detectDialect('SHOW CREATE TABLE users')).toBe('mysql');
    });

    it('DESCRIBE → mysql', () => {
      expect(detectDialect('DESCRIBE users')).toBe('mysql');
    });

    it('DELAYED → mysql', () => {
      expect(detectDialect('INSERT DELAYED INTO users VALUES (1)')).toBe('mysql');
    });

    it('TINYINT → mysql（弱信号）', () => {
      expect(detectDialect('score TINYINT')).toBe('mysql');
    });

    it('MEDIUMINT → mysql（弱信号）', () => {
      expect(detectDialect('score MEDIUMINT')).toBe('mysql');
    });

    it('SMALLINT → mysql（弱信号）', () => {
      expect(detectDialect('score SMALLINT')).toBe('mysql');
    });

    it('BIGINT → mysql（弱信号）', () => {
      expect(detectDialect('score BIGINT')).toBe('mysql');
    });
  });

  describe('PostgreSQL 模式匹配', () => {
    it(':: 类型转换 → postgresql', () => {
      expect(detectDialect('SELECT id::text FROM users')).toBe('postgresql');
    });

    it('::numeric(n) 带参数类型转换 → postgresql', () => {
      expect(detectDialect('SELECT cost::numeric(10,2) FROM orders')).toBe('postgresql');
    });

    it('ILIKE → postgresql', () => {
      expect(detectDialect("SELECT * FROM users WHERE name ILIKE '%foo%'")).toBe('postgresql');
    });

    it('SERIAL → postgresql', () => {
      expect(detectDialect('CREATE TABLE users (id SERIAL PRIMARY KEY)')).toBe('postgresql');
    });

    it('BIGSERIAL → postgresql', () => {
      expect(detectDialect('CREATE TABLE logs (id BIGSERIAL)')).toBe('postgresql');
    });

    it('SMALLSERIAL → postgresql', () => {
      expect(detectDialect('CREATE TABLE config (id SMALLSERIAL)')).toBe('postgresql');
    });

    it('RETURNING → postgresql', () => {
      expect(detectDialect('INSERT INTO users VALUES (1) RETURNING id')).toBe('postgresql');
    });

    it('DELETE RETURNING → postgresql', () => {
      expect(detectDialect('DELETE FROM users WHERE id=1 RETURNING *')).toBe('postgresql');
    });

    it('ARRAY[...] → postgresql', () => {
      expect(detectDialect('SELECT ARRAY[1, 2, 3]')).toBe('postgresql');
    });

    it('$$ 美元引号 → postgresql', () => {
      expect(detectDialect('SELECT $$hello world$$')).toBe('postgresql');
    });

    it('ON CONFLICT DO NOTHING → postgresql', () => {
      expect(detectDialect('INSERT INTO users VALUES (1) ON CONFLICT (id) DO NOTHING')).toBe('postgresql');
    });

    it('ON CONFLICT DO UPDATE → postgresql', () => {
      expect(detectDialect('INSERT INTO users VALUES (1) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name')).toBe('postgresql');
    });

    it('DISTINCT ON → postgresql', () => {
      expect(detectDialect('SELECT DISTINCT ON (dept_id) * FROM emp ORDER BY dept_id, salary DESC')).toBe('postgresql');
    });

    it('CONCURRENTLY → postgresql', () => {
      expect(detectDialect('CREATE INDEX CONCURRENTLY idx ON users(name)')).toBe('postgresql');
    });

    it('NOWAIT → postgresql', () => {
      expect(detectDialect('SELECT * FROM users FOR UPDATE NOWAIT')).toBe('postgresql');
    });

    it('SKIP LOCKED → postgresql', () => {
      expect(detectDialect('SELECT * FROM jobs FOR UPDATE SKIP LOCKED')).toBe('postgresql');
    });

    it('EXCLUDE USING → postgresql', () => {
      expect(detectDialect('CREATE TABLE t (EXCLUDE USING gist (id WITH =))')).toBe('postgresql');
    });

    it('JSONB → postgresql', () => {
      expect(detectDialect('CREATE TABLE t (data JSONB)')).toBe('postgresql');
    });

    it('CITEXT → postgresql', () => {
      expect(detectDialect('CREATE TABLE t (name CITEXT)')).toBe('postgresql');
    });

    it('GENERATED ALWAYS AS IDENTITY → postgresql', () => {
      expect(detectDialect('id INT GENERATED ALWAYS AS IDENTITY')).toBe('postgresql');
    });

    it('GENERATED BY DEFAULT AS IDENTITY → postgresql', () => {
      expect(detectDialect('id INT GENERATED BY DEFAULT AS IDENTITY')).toBe('postgresql');
    });

    it('XML → postgresql（弱信号）', () => {
      expect(detectDialect('CREATE TABLE t (data XML)')).toBe('postgresql');
    });

    it('BOOLEAN → postgresql（弱信号）', () => {
      expect(detectDialect('flag BOOLEAN')).toBe('postgresql');
    });
  });

  describe('边界情况', () => {
    it('空字符串 → 默认 mysql', () => {
      expect(detectDialect('')).toBe('mysql');
    });

    it('纯空白 → 默认 mysql', () => {
      expect(detectDialect('  \n  ')).toBe('mysql');
    });

    it('中性 SQL → 默认 mysql（平局回退）', () => {
      expect(detectDialect('SELECT * FROM users WHERE id = 1')).toBe('mysql');
    });

    it('只有 -- 注释 → 默认 mysql（无任何方言特征）', () => {
      expect(detectDialect('-- just a comment')).toBe('mysql');
    });

    it('SERIALIZABLE 不应误触 SERIAL 规则', () => {
      expect(detectDialect('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')).toBe('mysql');
    });

    it('大小写混合：id::TEXT 仍正确识别', () => {
      expect(detectDialect('SELECT id::TEXT FROM t')).toBe('postgresql');
    });

    it('iLike 大小写变体', () => {
      expect(detectDialect("SELECT * FROM t WHERE name iLike '%foo%'")).toBe('postgresql');
    });
  });

  describe('综合场景', () => {
    it('复杂真实 MySQL 查询（含反引号、SHOW、ENGINE）', () => {
      const sql = [
        'CREATE TABLE `orders` (',
        '  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,',
        '  `user_id` INT(11) NOT NULL,',
        '  `amount` DECIMAL(10,2) NOT NULL,',
        '  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,',
        '  PRIMARY KEY (`id`)',
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;',
      ].join('\n');
      expect(detectDialect(sql)).toBe('mysql');
    });

    it('复杂真实 PostgreSQL 查询（含 ::类型转换、RETURNING）', () => {
      const sql = [
        'WITH updated AS (',
        '  UPDATE users',
        "  SET name = 'foo',",
        '      updated_at = NOW()',
        '  WHERE id = 42',
        '  RETURNING id, name::text, created_at::date',
        ')',
        'SELECT * FROM updated;',
      ].join('\n');
      expect(detectDialect(sql)).toBe('postgresql');
    });

    it('MySQL 权重压倒 PG 弱信号', () => {
      // BOOLEAN(w2 PG) + XML(w2 PG) vs 反引号(w5 MySQL) → MySQL 胜
      expect(detectDialect('SELECT `id`, flag BOOLEAN, data XML FROM t')).toBe('mysql');
    });

    it('PG 权重压倒 MySQL 弱信号', () => {
      // `::text`(w5 PG) vs BIGINT(w1 MySQL) → PG 胜
      expect(detectDialect('SELECT id::text, score BIGINT FROM t')).toBe('postgresql');
    });
  });
});
