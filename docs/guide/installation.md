# 安装

## 前置要求

- Node.js >= 18
- npm

## 全局安装（推荐）

```bash
npm install -g @badai147/dbsqlfmt
```

安装完成后即可使用 `dbsqlfmt` 命令：

```bash
dbsqlfmt --version
```

## 本地开发安装

```bash
# 克隆仓库
git clone https://github.com/badai147/dbsqlfmt.git
cd dbsqlfmt

# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 链接到全局
npm link

# 运行
dbsqlfmt format path/to/file.sql
```

## 作为项目依赖安装

```bash
npm install @badai147/dbsqlfmt
```

然后在 `package.json` 中配置脚本：

```json
{
  "scripts": {
    "format:sql": "dbsqlfmt format src/queries/*.sql --dry-run"
  }
}
```
