# 更新日志

## v0.1.4 — 大小写精细化控制 & 默认全部大写

- **4 个独立大小写选项**：新增 `--keyword-case` / `--data-type-case` / `--function-case` / `--identifier-case`，均支持 `upper` / `lower` / `preserve` 三种值
- **默认全部大写**：所有 case 选项默认值改为 `upper`（原默认 `preserve`）
- **向后兼容**：保留 `-u` / `--uppercase` 快捷开关，独立选项优先级更高
- 配置文件 `.dbsqlfmtrc` 新增 `keywordCase` / `dataTypeCase` / `functionCase` / `identifierCase` 四个配置键
- 白名单 `ALLOWED_KEYS` 同步更新

---

## v0.1.3 — 安全加固

- **配置文件键白名单**：只允许 `language` / `indent` / `uppercase` / `dryRun` 等八个键
- **DoS 防护**：配置文件超过 1MB 直接拒绝加载
- **符号链接保护**：拒绝通过符号链接写入文件
- **原子写入**：临时文件 + `copyFile` 机制，避免写入中断导致文件损坏
- CLI 顶层 try-catch，统一捕获运行时错误

---

## v0.1.2 — 方言自动检测

- 实现 **加权评分算法**，自动识别 MySQL 或 PostgreSQL 方言
- MySQL 检测：反引号标识符、`AUTO_INCREMENT`、`ON DUPLICATE KEY UPDATE` 等
- PostgreSQL 检测：`::cast`、`ILIKE`、`SERIAL`、`RETURNING`、`ARRAY[...]`、`$$` 等
- 平局默认走 MySQL
- 帮助信息重构，展示所有选项及使用示例

---

## v0.1.1 — 配置系统

- 支持 `.dbsqlfmtrc` JSON 配置文件
- CLI 命令行选项优先级高于配置文件
- 默认方言从 `sql` 改为 `mysql`

---

## v0.1.0 — 初始版本

- 基于 sql-formatter 的 SQL 格式化 CLI 工具
- TypeScript + Commander 框架
- 支持 MySQL / PostgreSQL 方言
- 支持缩进、关键字大写、dry-run 等选项
