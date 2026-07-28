# 用法

## 基本用法

```bash
dbsqlfmt format <file> [options]
```

格式化指定的 SQL 文件，不限制文件后缀。默认自动检测方言，所有关键字、数据类型、函数名、标识符全部转为大写。

### 基础格式化

```bash
dbsqlfmt format query.sql
```

自动检测方言，输出格式化后的 SQL。

### 指定方言

```bash
dbsqlfmt format query.sql --language postgresql
```

跳过自动检测，强制使用 PostgreSQL 方言。

### 关键字小写

```bash
dbsqlfmt format query.sql --keyword-case lower
```

将关键字转为小写，数据类型和函数名保持默认大写。

### 组合控制

```bash
dbsqlfmt format query.sql \
  --keyword-case upper \
  --data-type-case lower \
  --function-case preserve
```

### 预览模式（不修改文件）

```bash
dbsqlfmt format query.sql --dry-run
```

仅将格式化结果输出到终端，不改写源文件。适合配合编辑器外部工具使用。

## 在 DBeaver 中使用

可将 dbsqlfmt 配置为 DBeaver 的外部工具：

- **命令**: `dbsqlfmt`
- **参数**: `format "${file}" --dry-run`
- **工作目录**: `${project_path}`

## 退出码

| 退出码 | 含义 |
|--------|------|
| 0 | 成功 |
| 1 | 运行时错误（文件不存在、语法错误等） |
