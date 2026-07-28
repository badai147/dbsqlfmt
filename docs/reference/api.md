# 编程调用

dbsqlfmt 也支持在 Node.js 代码中以编程方式调用。

## `formatFile(filePath, options)`

格式化指定 SQL 文件。

```typescript
import { formatFile } from '@badai147/dbsqlfmt'

formatFile('query.sql', {
  language: 'postgresql',
  keywordCase: 'lower',
  dryRun: true,
})
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `filePath` | `string` | SQL 文件的路径 |
| `options` | `Config` | 格式化选项对象 |

### `Config` 类型

```typescript
interface Config {
  language?: string        // 'mysql' | 'postgresql'
  indent?: string          // 缩进空格数
  uppercase?: boolean      // --uppercase 快捷方式
  dryRun?: boolean         // 仅输出到终端
  keywordCase?: string     // 'upper' | 'lower' | 'preserve'
  dataTypeCase?: string    // 'upper' | 'lower' | 'preserve'
  functionCase?: string    // 'upper' | 'lower' | 'preserve'
  identifierCase?: string  // 'upper' | 'lower' | 'preserve'
}
```
