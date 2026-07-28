# 配置文件

在项目根目录创建 `.dbsqlfmtrc` 文件，使用 JSON 格式持久化配置。

## 示例

```json
{
  "language": "mysql",
  "indent": "4",
  "keywordCase": "upper",
  "functionCase": "lower"
}
```

## 可用配置键

| 键 | 类型 | 默认值 | 说明 |
|----|------|--------|------|
| `language` | `string` | 自动检测 | SQL 方言：`mysql` / `postgresql` |
| `indent` | `string` | `"2"` | 缩进空格数 |
| `uppercase` | `boolean` | — | `keywordCase: "upper"` 的快捷方式 |
| `dryRun` | `boolean` | `false` | 仅输出到终端，不改写文件 |
| `keywordCase` | `string` | `"upper"` | 关键字大小写：`upper` / `lower` / `preserve` |
| `dataTypeCase` | `string` | `"upper"` | 数据类型大小写：`upper` / `lower` / `preserve` |
| `functionCase` | `string` | `"upper"` | 函数名大小写：`upper` / `lower` / `preserve` |
| `identifierCase` | `string` | `"upper"` | 标识符大小写：`upper` / `lower` / `preserve`（实验性） |

## 合并规则

CLI 命令行选项会覆盖配置文件中的同名设置。

```
最终配置 = 配置文件配置 + CLI 选项覆盖
```

## 安全机制

- **键白名单**：只允许上表列出的键，其他键被自动过滤
- **大小限制**：配置文件超过 1MB 直接拒绝加载，防止恶意大文件
