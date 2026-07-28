# 方言检测

当不指定 `--language` 时，dbsqlfmt 使用加权评分算法自动识别 SQL 方言。

## 算法原理

对输入的 SQL 文本分别计算 MySQL 和 PostgreSQL 两组模式的权重总和，**得分高的方言胜出**。平局默认走 MySQL。

```
mysqlScore = Σ(匹配模式的权重)
pgScore   = Σ(匹配模式的权重)

if mysqlScore > pgScore → mysql
if pgScore > mysqlScore → postgresql
else → mysql（平局默认）
```

## MySQL 检测模式

| 模式 | 权重 | 说明 |
|------|------|------|
| `` `ident` `` | 5 | 反引号标识符 |
| `AUTO_INCREMENT` | 5 | 自增列 |
| `ON DUPLICATE KEY UPDATE` | 5 | 重复键更新 |
| `ENGINE=` | 5 | 存储引擎 |
| `REPLACE INTO` | 5 | 替换插入 |
| `# 行注释` | 3 | MySQL 特有的行注释语法 |
| `INT(N)` | 3 | 显示宽度语法 |
| `UNSIGNED` | 3 | 无符号类型 |
| `CHARACTER SET` / `CHARSET` | 3 | 字符集 |
| `FULLTEXT` | 3 | 全文索引 |
| `SPATIAL` | 3 | 空间索引 |
| `ROW_FORMAT` | 3 | 行格式 |
| `LOCK TABLES` / `UNLOCK TABLES` | 3 | 表锁 |
| `STRAIGHT_JOIN` | 3 | 强制连接顺序 |
| `SQL_CALC_FOUND_ROWS` | 3 | 计算行数 |
| `SHOW ...` | 3 | SHOW 语句 |
| `DESCRIBE` | 3 | 描述表结构 |
| `DELAYED` | 2 | 延迟插入 |
| `TINYINT` / `MEDIUMINT` / `SMALLINT` / `BIGINT` | 1 | 整数类型 |

## PostgreSQL 检测模式

| 模式 | 权重 | 说明 |
|------|------|------|
| `::type` | 5 | 类型转换 |
| `ILIKE` | 5 | 不区分大小写的 LIKE |
| `SERIAL` / `BIGSERIAL` / `SMALLSERIAL` | 5 | 自增序列 |
| `RETURNING` | 5 | 返回子句 |
| `ARRAY[...]` | 5 | 数组字面量 |
| `$$` | 5 | 美元符字符串 |
| `ON CONFLICT` | 4 | UPSERT |
| `DISTINCT ON` | 4 | 去重排序 |
| `TABLESPACE` | 3 | 表空间 |
| `CONCURRENTLY` | 3 | 并发索引 |
| `NOWAIT` | 3 | 不等待锁 |
| `SKIP LOCKED` | 3 | 跳过已锁 |
| `EXCLUDE USING` | 3 | 排除约束 |
| `GENERATED ... AS IDENTITY` | 4 | 标识列 |
| `CITEXT` | 3 | 不区分大小写的文本类型 |
| `JSONB` | 3 | 二进制 JSON |
| `XML` | 2 | XML 类型 |
| `BOOLEAN` | 2 | 布尔类型 |

## 强制指定方言

如果自动检测结果不满足需求，可以显式指定方言：

```bash
dbsqlfmt format query.sql --language postgresql
```

显式传入后跳过自动检测。
