# 更新日志

## v0.1.4 (2026-07-01)

### 大小写精细化控制

- **4 个独立大小写选项**：新增 `--keyword-case`、`--data-type-case`、`--function-case`、`--identifier-case`，均支持 `upper` / `lower` / `preserve` 三种值
- **默认全部大写**：所有 case 选项默认值改为 `upper`（原默认 `preserve`）
- **向后兼容**：保留 `-u` / `--uppercase` 快捷开关，`--keyword-case` 等显式选项优先级更高

### 配置系统扩展

- `.dbsqlfmtrc` 配置文件新增 `keywordCase`、`dataTypeCase`、`functionCase`、`identifierCase` 四个键
- `ALLOWED_KEYS` 白名单同步更新

### 文档与测试

- 全量测试从 86 条增至 95 条
- 新增大小写选项相关测试用例（keywordCase 优先级、各 case 选项独立控制、配置文件新键等）
- 更新 README 选项表格、使用示例、配置文件示例

---

## v0.1.3 (2025-06-24)

### 安全加固

- **配置文件键白名单**：`.dbsqlfmtrc` 只允许 `language`、`indent`、`uppercase`、`dryRun` 四个键，其他键被自动过滤
- **DoS 防护**：配置文件超过 1MB 直接拒绝加载，防止恶意大文件
- **符号链接保护**：`writeFile()` 拒绝通过符号链接写入文件，防止提权攻击
- **原子写入**：写入使用临时文件 + `copyFile` 机制，避免写入中断导致文件损坏

### 文件操作健壮性

- **`readFile()` 校验**：检查文件存在性、路径是否为文件、文件大小上限（100MB）
- **`writeFile()` 增强**：拒绝符号链接，原子写入保证数据安全
- **`print()`**：新增工具函数，统一输出逻辑

### 错误处理优化

- **CLI 顶层 try-catch**：统一捕获运行时错误，输出错误信息并以退出码 1 终止
- **`formatFile()` 简化**：移除内部 try-catch，将错误处理上提到 CLI 层，职责更清晰

### 测试覆盖

- 新增 `config.test.ts`（6 条）：配置加载、键白名单、CLI 覆盖优先级、大文件拒绝
- 新增 `utils.test.ts`（6 条）：`readFile()` 文件不存在/非文件/超大文件、`writeFile()` 符号链接拒绝、原子写入
- 新增 `index.test.ts`（5 条）：`formatFile()` 端到端流程、dryRun、自动检测、错误传播、uppercase 选项
- 全量测试从 69 条增至 86 条

---

## v0.1.2 (2025-06-23)

### 方言自动检测

- 实现 **`detectDialect(sql)` 加权评分算法**，无需指定 `--language` 即可自动识别 MySQL 或 PostgreSQL
- MySQL 检测模式（权重 5）：反引号标识符 `` `ident` ``、`AUTO_INCREMENT`、`ON DUPLICATE KEY UPDATE`、`ENGINE=`、`REPLACE INTO`
- PostgreSQL 检测模式（权重 5）：`::cast`、`ILIKE`、`SERIAL`/`BIGSERIAL`、`RETURNING`、`ARRAY[...]`、`$$` 美元符字符串
- 平局默认走 MySQL

### 帮助信息改进

- `-h`/`--help` 输出重构，展示所有选项及使用示例
- 新增 `format <file>` 子命令描述，支持 `dbsqlfmt format --help` 查看详细选项

### 文档完善

- 新增 `detect.test.ts` 60 条用例，每个方言特征模式独立覆盖
- 更新 `README.md` 方言描述与自动检测说明

---

## v0.1.1 (2025-06-22)

### 配置系统

- 支持 `.dbsqlfmtrc` JSON 配置文件，在项目根目录自动加载
- 配置文件与 CLI 选项合并，CLI 命令行选项优先级更高

### 功能优化

- 默认方言从 `sql` 改为 **`mysql`**，更符合实际使用场景
- 添加 `npm prepare` hook，全局安装（`npm link` / `npm i -g`）时自动编译
- 修复 `--dry-run` 输出末尾缺少换行的问题

### 文档更新

- 更新 README 安装指南、仓库 URL
- README 方言列表修正为已验证的 `mysql`、`postgresql`

---

## v0.1.0 (2025-06-21)

### 初始版本

- 基于 [sql-formatter](https://github.com/sql-formatter-org/sql-formatter) 的 SQL 格式化 CLI 工具
- TypeScript + Commander 框架搭建

### 支持的命令行选项

| 选项 | 描述 | 默认值 |
|---|---|---|
| `-l, --language <lang>` | SQL 方言（`mysql` / `postgresql` / `sql`） | `sql` |
| `-i, --indent <size>` | 缩进空格数 | `2` |
| `-u, --uppercase` | 关键字大写 | 关闭 |
| `--dry-run` | 仅输出到终端，不写回文件 | 关闭 |
| `-V, --version` | 查看版本号 | |
| `-h, --help` | 查看帮助信息 | |

### 项目结构

- `cli.ts` — Commander 参数解析与命令注册
- `index.ts` — `formatFile()` 主流程编排
- `formatter.ts` — `formatSql()` sql-formatter 封装
- `config.ts` — 配置加载与合并（预留）
- `utils.ts` — 文件读写工具函数

### 测试

- `formatter.test.ts` 9 条集成测试：方言透传、自动检测钩入、选项正确性
