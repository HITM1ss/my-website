# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在此仓库中处理代码时提供指引。

## 项目概览

Firefly 是一个功能丰富的静态博客主题，基于 **Astro 7** 构建，并使用 **Svelte 5** 开发交互式组件。它由 [Fuwari](https://github.com/saicaca/fuwari) 分叉而来，并扩展了大量功能。主要语言为简体中文，同时支持 en、zh_TW、ja、ru 的国际化。

## 命令

| 命令 | 用途 |
|---|---|
| `pnpm dev` | 在 `localhost:4321` 启动开发服务器 |
| `pnpm build` | 生产构建（图标 → LQIP → Astro 构建 → Pagefind 索引） |
| `pnpm preview` | 预览生产构建结果 |
| `pnpm check` | 使用 `astro check` 执行类型和错误检查 |
| `pnpm type-check` | 执行 `tsc --noEmit --isolatedDeclarations` |
| `pnpm lint` | 使用 Biome 执行代码检查并自动修复 |
| `pnpm format` | 使用 Biome 格式化代码 |
| `pnpm new-post <filename>` | 创建新博客文章的脚手架 |

项目强制使用 **pnpm** 作为包管理器，要求 Node.js >= 22。

## 架构

### Astro + Svelte 混合架构

- `.astro` 组件用于静态内容和布局。
- `.svelte` 组件用于交互式 UI（搜索、设置、分页、归档），通过 `client:load` 或 `client:visible` 挂载。
- Swup.js 通过多个容器目标处理类似 SPA 的页面过渡。

### 配置驱动

所有功能均通过 `src/config/` 中的 TypeScript 文件启用或配置，并由 `src/config/index.ts` 中的桶文件导出。主要配置包括：

- `siteConfig.ts` — 网站核心设置、主题和分页。
- `sidebarConfig.ts` — 侧边栏布局（左侧、右侧、双侧及小部件排序）。
- `commentConfig.ts`、`analyticsConfig.ts`、`fontConfig.ts` 等。

### HTML 应用接入

静态 HTML 应用采用“静态文件 + 集中配置”的接入方式：

- `src/pages/app/index.astro` 是应用首页，使用 `MainGridLayout` 展示已注册的应用卡片。
- `src/config/appConfig.ts` 集中维护 `appConfig` 数组；类型 `AppItem` 和 `AppConfig` 定义在 `src/types/appConfig.ts`。
- 每个应用支持 `name`、`description`、`url`、`icon`、`image`、`tags`、`enabled` 字段；新增应用必须填写 `image`，`enabled` 省略时默认展示。
- 应用文件及其静态资源存放于 `public/app/`：单页应用可使用 `public/app/<name>.html`，多页应用可使用 `public/app/<name>/index.html`，并分别注册为 `/app/<name>.html` 或 `/app/<name>/`。
- 预览图也应放在 `public/app/`，推荐使用反映核心界面的 `1200 × 800` SVG 或 WebP。
- `src/config/navBarConfig.ts` 中的“应用”入口必须保持指向 `/app/`，而非某个具体应用页面。

新增应用时：添加应用和预览图（及所需资源）→ 在 `appConfig` 中注册并启用 → 运行 `pnpm dev`，访问 `/app/` 验证卡片预览与新标签页跳转正常 → 同步更新 `docs/app-integration.md`。

### 布局系统

- `Layout.astro` — 基础 HTML 外壳（head、body、主题初始化、分析和 Swup 钩子）。
- `MainGridLayout.astro` — 包含侧边栏、导航栏、壁纸和页脚的完整页面网格。

### 内容集合

定义于 `src/content.config.ts`：

- `posts` — 博客文章（`.md`/`.mdx`），支持 title、published、tags、category、draft、pinned、password、comment 等 frontmatter 字段。
- `spec` — 特殊页面（关于、留言板）。
- `dynamic` — 随手记录与日常动态，递归读取 `src/content/dynamic/` 下的 `.md`/`.mdx`，仅要求 `published` 日期字段，不要求标题。

### 动态内容

完整规范和示例见 [动态内容写作与存放指南](docs/dynamic-content.md)。

- 一条动态一个文件；现有 `26.8.31.md` 等日期式命名是整理约定，文件名不决定显示时间或排序。
- `published` 应填写未加引号的 YAML 日期，建议显式带时区，如 `2026-10-10T18:30:00+08:00`。现有无时区写法按 UTC 解析；`siteConfig.timezone` 只控制显示转换。
- 图片沿用 `src/content/dynamic/image_d/`，正文使用相对路径，如 `![图片说明](image_d/26.8.31.avif)`；子目录中的动态需调整相对路径。现有 AVIF 格式不是强制要求。
- `src/pages/dynamic/index.astro` 在 `/dynamic/` 统一渲染正文，按 `published` 时间倒序展示，并提供年份筛选和客户端分页。
- `src/config/dynamicConfig.ts` 的 `itemsPerPage` 当前为 10；`siteConfig.pages.dynamic` 控制页面开关，作者名称和头像来自 `profileConfig`。
- `location` 目前未在 schema 中声明，也未在页面显示；动态没有实现 `draft`、置顶或未来日期隐藏逻辑。扩展字段和发布行为时需要同步修改集合 schema 与页面。
- 文件标识用于生成页面内固定链接锚点，重命名或移动已发布文件可能改变链接。

### 关键目录

- `src/components/` — 按领域组织：`analytics/`、`comment/`、`common/`、`controls/`、`features/`、`layout/`、`misc/`、`pages/`、`widget/`。
- `src/plugins/` — 15 个自定义 remark/rehype 插件（Mermaid、PlantUML、KaTeX、GitHub 卡片、阅读时长等）。
- `src/i18n/` — 翻译键位于 `i18nKey.ts`，语言文件位于 `languages/*.ts`，通过 `translation.ts` 查询。
- `src/utils/` — 内容排序、加密文章、日期格式化、图像处理/LQIP、目录生成。
- `src/pages/` — Astro 基于文件的路由。
- `scripts/` — 构建时工具（`generate-icons.js`、`generate-lqips.ts`、`new-post.js`）。

### 路径别名（tsconfig.json）

`@components/*`、`@assets/*`、`@constants/*`、`@utils/*`、`@i18n/*`、`@layouts/*` → `./src/<dir>/*`；`@/*` → `./src/*`

## 代码风格

- **Biome** 强制使用制表符缩进、双引号和推荐的代码检查规则。
- `.svelte`/`.astro` 文件使用较宽松的规则（关闭 useConst 和 noUnusedVariables）。
- 提交规范：**Conventional Commits**（`feat:`、`fix:`、`chore:` 等）。

## 构建流水线

多步流程：`scripts/generate-icons.js` → `scripts/generate-lqips.ts` → `astro build` → `pagefind --site dist`

图标和 LQIP 数据会生成到 `src/constants/` 并提交至仓库。可使用 `pnpm icons` 或 `pnpm lqips` 重新生成。

## 部署

- **Vercel**（默认，`vercel.json`）。
- **Cloudflare Workers**（`wrangler.jsonc`，设置 `CF_WORKERS` 环境变量）。
- 静态输出目录为 `dist/`。

