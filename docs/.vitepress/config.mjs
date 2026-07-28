import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'dbsqlfmt',
  description: 'SQL 格式化 CLI 工具，自动识别方言，开箱即用',
  base: '/dbsqlfmt/',

  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '参考', link: '/reference/cli-options' },
      { text: '更新日志', link: '/changelog' },
      { text: 'GitHub', link: 'https://github.com/badai147/dbsqlfmt' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '简介', link: '/guide/' },
          { text: '安装', link: '/guide/installation' },
          { text: '用法', link: '/guide/usage' },
          { text: '配置文件', link: '/guide/configuration' },
          { text: '方言检测', link: '/guide/dialect-detection' },
        ],
      },
      {
        text: '参考',
        items: [
          { text: 'CLI 选项', link: '/reference/cli-options' },
          { text: '编程调用', link: '/reference/api' },
        ],
      },
      {
        text: '更多',
        items: [
          { text: '更新日志', link: '/changelog' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/badai147/dbsqlfmt' },
    ],

    footer: {
      message: 'MIT 许可证',
      copyright: '版权所有 © badai147',
    },

    editLink: {
      pattern: 'https://github.com/badai147/dbsqlfmt/edit/main/docs/:path',
    },
  },
})
