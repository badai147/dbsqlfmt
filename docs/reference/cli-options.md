# CLI 选项参考

## 用法

```bash
dbsqlfmt format <file> [options]
```

## 选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-l, --language <lang>` | SQL 方言（`mysql` / `postgresql`） | 自动检测 |
| `-i, --indent <size>` | 缩进空格数 | `2` |
| `-u, --uppercase` | `--keyword-case upper` 的快捷方式 | — |
| `--keyword-case <style>` | 关键字大小写：`upper` / `lower` / `preserve` | `upper` |
| `--data-type-case <style>` | 数据类型大小写：`upper` / `lower` / `preserve` | `upper` |
| `--function-case <style>` | 函数名大小写：`upper` / `lower` / `preserve` | `upper` |
| `--identifier-case <style>` | 标识符大小写：`upper` / `lower` / `preserve`（实验性） | `upper` |
| `--dry-run` | 仅输出到终端，不改写文件 | — |
| `-V, --version` | 查看版本号 | — |
| `-h, --help` | 查看帮助信息 | — |

## 示例

```bash
# 默认（所有大写）
dbsqlfmt format query.sql

# PostgreSQL 方言
dbsqlfmt format query.sql -l postgresql

# 关键字小写
dbsqlfmt format query.sql --keyword-case lower

# 预览模式
dbsqlfmt format query.sql --dry-run

# 组合：PG + 缩进 4 + 函数名保持原样
dbsqlfmt format query.sql -l postgresql -i 4 --function-case preserve
```
