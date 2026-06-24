# 测试

使用 [vitest](https://vitest.dev/) 框架。

## 运行

```bash
# 全量测试
npm test

# 监听模式（开发时用）
npm run test:watch
```

## 测试文件

| 文件 | 用例数 | 说明 |
|---|---|---|
| `detect.test.ts` | 60 | `detectDialect()` 单元测试，验证每个方言特征模式的精确匹配 |
| `formatter.test.ts` | 9 | `formatSql()` 集成测试，验证方言检测与格式化的端到端流程 |
| `config.test.ts` | 6 | `mergeConfig()` 测试：配置加载、键白名单过滤、CLI 覆盖优先级、大文件拒绝 |
| `utils.test.ts` | 6 | `readFile()` / `writeFile()` 测试：文件校验、符号链接拒绝、超大文件 |
| `index.test.ts` | 5 | `formatFile()` 端到端测试：格式化写入、dryRun、自动检测、错误传播 |

## 覆盖范围

### detect.test.ts

| 分类 | 用例数 | 内容 |
|---|---|---|
| MySQL 模式匹配 | 25 | 每个 MySQL 特征信号单独验证（反引号、AUTO_INCREMENT、ENGINE=、SHOW、DESCRIBE 等） |
| PostgreSQL 模式匹配 | 22 | 每个 PG 特征信号单独验证（::类型转换、ILIKE、SERIAL、RETURNING、美元引号、JSONB 等） |
| 边界情况 | 6 | 空字符串、纯空白、中性 SQL、SERIALIZABLE 误触防护、大小写 |
| 综合场景 | 5 | 真实复杂查询、权重压倒验证 |

### formatter.test.ts

| 分类 | 用例数 | 内容 |
|---|---|---|
| 显式方言 | 2 | 明确传 `language: 'mysql'` / `'postgresql'` 时正确格式化 |
| 自动检测 | 2 | 不传 language 时自动识别 MySQL（反引号）和 PG（`::`） |
| 格式化选项 | 2 | `uppercase` 开关、`indent` 缩进 |
| 端到端 | 2 | 真实复杂 SQL 全流程 |

### config.test.ts

| 分类 | 用例数 | 内容 |
|---|---|---|
| 基本合并 | 3 | 无配置文件、CLI 覆盖、CLI undefined 忽略 |
| 安全过滤 | 2 | 键白名单过滤、无效 JSON 容错 |
| DoS 防护 | 1 | 超大配置文件拒绝 |

### utils.test.ts

| 分类 | 用例数 | 内容 |
|---|---|---|
| readFile | 4 | 正常读取、不存在文件、目录路径、超大文件 |
| writeFile | 2 | 正常写入、符号链接拒绝 |

### index.test.ts

| 分类 | 用例数 | 内容 |
|---|---|---|
| formatFile | 5 | 格式化写入、dryRun 只读、错误传播、自动检测、uppercase 选项 |

## 添加测试的原则

- 每个方言特征（正则模式）都要有独立的匹配用例
- 边界情况/误触防护（如 `SERIALIZABLE` 不应匹配 `SERIAL`）
- 权重碾压测试（强信号压倒弱信号）
- 新增特征规则时必须配套新增测试用例
