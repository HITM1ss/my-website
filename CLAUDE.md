# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在此仓库中处理代码时提供指引。

## 项目概览

Firefly 是一个功能丰富的静态博客主题，基于 **Astro 6** 构建，并使用 **Svelte 5** 开发交互式组件。它由 [Fuwari](https://github.com/saicaca/fuwari) 分叉而来，并扩展了大量功能。主要语言为简体中文，同时支持 en、zh_TW、ja、ru 的国际化。

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

