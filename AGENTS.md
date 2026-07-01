# dbsqlfmt — agent 指南

## 命令
- `npm run build` — `tsc`, 编译 `src/` → `dist/`
- `npm test` — `vitest run`（95 条用例，5 个文件）
- `npm run test:watch` — `vitest`（监听模式）

## 架构
```
cli.ts (Commander) → index.ts:formatFile → formatter.ts:formatSql
                                          ↘ detect.ts:detectDialect（自动检测）
```

- 入口：`cli.ts`（bin: `dbsqlfmt` → `dist/cli.js`）
- 配置：cwd 下的 `.dbsqlfmtrc` JSON，与 CLI 选项合并（CLI 优先）
- `--language` 显式传入 → 直接使用；省略 → `detectDialect(sql)` 加权评分检测
- 大小写控制：`keywordCase`、`dataTypeCase`、`functionCase`、`identifierCase`，默认均为 `upper`

## 关键事实
- `CommonJS` 模块（`"type": "commonjs"`），TS 目标 ES2020
- 发布为 `@badai147/dbsqlfmt`，npm 包仅包含 `dist/` + `LICENSE` + `README.md`
- 依赖：`sql-formatter`、`commander`、`vitest`、`typescript`
- `vitest.config.ts` — 排除 `dist/` 目录避免编译产物干扰测试
- `cli.ts` shebang 行用了 `require('../package.json')`（因此有 eslint-disable 注释）
- 没有 lint/typecheck 脚本 —— build = typecheck

## 检测规则（`detect.ts`）
- MySQL 模式（权重 5 → `` `ident` ``、`AUTO_INCREMENT`、`ON DUPLICATE KEY UPDATE`、`ENGINE=`、`REPLACE INTO`）
- PG 模式（权重 5 → `::cast`、`ILIKE`、`SERIAL`/`BIGSERIAL`、`RETURNING`、`ARRAY[...]`、`$$`）
- 平局 → `mysql`（默认）
- 新增模式：向对应数组添加 `[RegExp, weight]`，并在 `detect.test.ts` 中 +1 条用例

## 测试约定
- 测试位于 `src/__tests__/`（vitest），TypeScript 文件直接运行（无需编译）
- `detect.test.ts` — 每个模式一条 `it()` + 边界情况 + 权重碾压场景
- `formatter.test.ts` — 集成验证：显式方言透传、自动检测钩入、所有大小写选项
- `config.test.ts` — 配置加载、键白名单、CLI 覆盖优先级、大文件拒绝
- `index.test.ts` — 端到端流程、dryRun、自动检测、错误传播、uppercase 选项
- `utils.test.ts` — 文件读写、边界情况、安全性验证

## 工作流程
写完代码后，必须按以下顺序执行：
1. 编写或更新测试（`src/__tests__/`）
2. `npm test` 验证全部通过
3. 更新相关文档（`AGENTS.md`、`README.md`、`package.json` 等）
