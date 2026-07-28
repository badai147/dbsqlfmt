# dbsqlfmt — agent 指南

## 命令
- `npm run build` — `tsc`, 编译 `src/` → `dist/`
- `npm test` — `vitest run`（95 条用例，5 个文件）
- `npm run test:watch` — `vitest`（监听模式）
- `npm run docs:dev` — `vitepress dev docs`，本地预览文档
- `npm run docs:build` — `vitepress build docs`，构建文档站点
- `npm run docs:preview` — `vitepress preview docs`，预览构建产物

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

## Release 内容模板

当需要写 GitHub Release 内容时，按以下格式输出：

```markdown
## v<版本号> — <一句话标题>

### <emoji> <分类名>
- **<加粗项>**：<说明>
- <普通项>

### 📦 安装

```bash
npm install -g @badai147/dbsqlfmt
```
```

### 格式规则
1. 标题行：`## vX.Y.Z — <描述>`，全角破折号 `—`
2. 分类用 `### <emoji> <标题>`，emoji + 空格 + 中文
3. 突出功能用 **加粗** + 全角冒号 `：`，普通条目直接写
4. 末尾固定以 `### 📦 安装` + 代码块收尾
