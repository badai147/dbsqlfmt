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

## 添加测试的原则

- 每个方言特征（正则模式）都要有独立的匹配用例
- 边界情况/误触防护（如 `SERIALIZABLE` 不应匹配 `SERIAL`）
- 权重碾压测试（强信号压倒弱信号）
- 新增特征规则时必须配套新增测试用例
