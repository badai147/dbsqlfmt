# 简介

**dbsqlfmt** 是一个基于 [sql-formatter](https://github.com/sql-formatter-org/sql-formatter) 的 SQL 格式化 CLI 工具。

## 特性

- 格式化单个 SQL 文件（不限制文件后缀）
- 支持 **MySQL** 和 **PostgreSQL** 两种方言
- **自动识别 SQL 方言**，无需手动指定
- 可自定义缩进大小
- **全面的关键字 / 数据类型 / 函数名 / 标识符大小写控制**（大写、小写、保持原样）
- `--dry-run` 预览模式，不改写文件
- 通过 `.dbsqlfmtrc` 配置文件持久化选项

## 快速上手

```bash
# 全局安装
npm install -g @badai147/dbsqlfmt

# 格式化 SQL 文件
dbsqlfmt format query.sql
```

## 项目地址

- GitHub: [badai147/dbsqlfmt](https://github.com/badai147/dbsqlfmt)
- npm: [@badai147/dbsqlfmt](https://www.npmjs.com/package/@badai147/dbsqlfmt)
