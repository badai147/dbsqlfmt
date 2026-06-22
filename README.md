# dbsqlfmt

![Version](https://img.shields.io/badge/version-0.1.1-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**dbsqlfmt** 是一个基于 [sql-formatter](https://github.com/sql-formatter-org/sql-formatter) 的 SQL 格式化 CLI 工具，支持 MySQL、PostgreSQL 两种方言，支持配置文件、关键字大写等特性。

## 目录

- [特性](#特性)
- [安装](#安装)
- [使用](#使用)
- [选项](#选项)
- [配置文件](#配置文件)
- [支持的方言](#支持的方言)
- [开发](#开发)
- [许可证](#许可证)

## 特性

- 格式化单个 SQL 文件（不限制文件后缀）
- 支持 MySQL 和 PostgreSQL 两种方言
- 可自定义缩进大小
- 关键字大写选项
- Dry-run 预览模式，不改写文件
- 通过 `.dbsqlfmtrc` 配置文件持久化选项

## 安装

```bash
# 从 GitHub 直接安装
npm install -g https://github.com/badai147/dbsqlfmt.git
```

或直接用 `npx` 无需安装：

```bash
npx github:badai147/dbsqlfmt format query.sql
```

本地开发用 `npm link`：

```bash
npm link
```

## 使用

```bash
dbsqlfmt format <file> [options]
```

### 示例

**基础格式化：**

```bash
dbsqlfmt format query.sql
```

**指定方言 + 关键字大写：**

```bash
dbsqlfmt format query.sql --language postgresql --uppercase
```

**仅预览结果，不写回文件：**

```bash
dbsqlfmt format query.sql --dry-run
```

**DBeaver 外部工具配置：**

```bash
dbsqlfmt format "${file}" --dry-run
```

## 选项

| 选项                    | 描述                     | 默认值 |
| ----------------------- | ------------------------ | ------ |
| `-l, --language <lang>` | SQL 方言（`mysql` / `postgresql`） | `mysql` |
| `-i, --indent <size>`   | 缩进空格数               | `2`    |
| `-u, --uppercase`       | 将关键字转为大写         | 关闭   |
| `--dry-run`             | 仅输出到终端，不改写文件 | 关闭   |
| `-V, --version`         | 查看版本号               |        |
| `-h, --help`            | 查看帮助信息             |        |

## 配置文件

在项目根目录创建 `.dbsqlfmtrc` 文件，使用 JSON 格式：

```json
{
  "language": "mysql",
  "indent": "4",
  "uppercase": true
}
```

CLI 命令行选项会覆盖配置文件中的同名设置。

## 支持的方言

`mysql` `postgresql`

## 开发

### 前置要求

- Node.js >= 18
- npm

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/badai147/dbsqlfmt.git
cd dbsqlfmt

# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 运行
node dist/cli.js format path/to/file.sql
```

### 项目结构

```
dbsqlfmt/
├── src/
│   ├── cli.ts        # Commander 参数解析与命令注册
│   ├── index.ts      # 主流程编排
│   ├── formatter.ts  # sql-formatter 封装
│   ├── config.ts     # 配置文件加载与合并
│   └── utils.ts      # 文件读写工具函数
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 许可证

MIT
