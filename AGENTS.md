# 仓库指南

## 项目结构与模块组织

Firefly 是一款包含 Svelte 交互组件的 Astro 7 静态博客主题。基于文件的路由位于 `src/pages/`；共享的 Astro 与 Svelte UI 按用途组织在 `src/components/` 下（如 `layout/`、`widget/`、`controls/` 和 `pages/`）。可复用布局、工具函数、样式、i18n 文案和功能配置分别位于 `src/layouts/`、`src/utils/`、`src/styles/`、`src/i18n/` 和 `src/config/`。

站点内容位于 `src/content/`：文章在 `posts/`，独立页面在 `spec/`，动态在 `dynamic/`。其 frontmatter 结构由 `src/content.config.ts` 定义。通用源码图片放入 `src/assets/`，动态图片沿用 `src/content/dynamic/image_d/` 的现有约定；需要直接提供给浏览器的文件、画廊媒体和应用资源放入 `public/`。图标与 LQIP 等构建辅助脚本位于 `scripts/`。

## 动态内容维护

详细写作步骤和示例见 [动态内容写作与存放指南](docs/dynamic-content.md)。修改动态时，以 `src/content.config.ts` 的 `dynamic` 集合和 `src/pages/dynamic/index.astro` 的实际行为为准。

- 一条动态对应 `src/content/dynamic/` 下的一个 `.md` 或 `.mdx` 文件，集合也会递归读取子目录。现有文件采用 `年.月.日.md`（如 `26.8.31.md`）；这是整理约定，代码没有强制命名格式，同日多条可增加后缀以避免重名。
- 动态 frontmatter 仅要求 `published` 日期字段，不要求 `title`。正文使用 Markdown；不要将博客文章的必填字段套用于动态。
- 新写动态建议显式填写时区，如 `published: 2026-10-10T18:30:00+08:00`，且不要加引号。现有不带时区的写法按 UTC 解析，站点的 `Asia/Shanghai` 设置只负责显示转换。
- 图片推荐继续放在 `image_d/`，正文使用相对于动态文件的路径，如 `![图片说明](image_d/26.8.31.avif)`。子目录中的动态需相应调整路径；AVIF 是现有格式，并非强制要求。
- `/dynamic/` 按 `published` 时间倒序展示，日期和排序不从文件名读取。每页数量由 `src/config/dynamicConfig.ts` 的 `itemsPerPage` 控制（当前为 10），页面开关为 `siteConfig.pages.dynamic`。
- 现有 `location` 字段未在集合 schema 中声明，页面也不显示；动态没有实现 `draft`、置顶或未来日期隐藏逻辑。新增字段或发布控制时，需同步修改 schema 和页面逻辑。
- 文件标识参与页面内固定链接锚点的生成，重命名或移动已发布动态可能改变链接。维护时注意已有引用。

## 构建、检查与开发命令

请使用 Node.js 22+ 和 pnpm 9+。

- `pnpm install --frozen-lockfile`：安装锁定版本的依赖。
- `pnpm dev`：在 `http://localhost:4321` 启动本地 Astro 开发服务器。
- `pnpm check`：执行 Astro 诊断；`pnpm type-check`：执行不产出文件的 TypeScript 类型检查。
- `pnpm exec biome ci ./src`：执行与 CI 相同、不会修改文件的 Biome 检查。
- `pnpm format` 和 `pnpm lint`：会修改 `src/` 下的文件，提交前请检查其改动。
- `pnpm build`：生成图标、LQIP、字体与 Pagefind 索引，然后输出 `dist/`；使用 `pnpm preview` 检查构建结果。
- `pnpm new-post`：生成新文章的脚手架。

## 编码风格与命名约定

以 Biome 规则为准：JavaScript/TypeScript 使用制表符缩进和双引号。保持导入有序，遵循相邻代码的既有写法，不要引入冲突的风格。组件使用 PascalCase 命名（例如 `PostCard.astro`），配置模块使用 `*Config.ts`，工具文件使用 kebab-case（例如 `content-utils.ts`）。优先使用 `tsconfig.json` 定义的 TypeScript 路径别名，如 `@components/*` 和 `@utils/*`。

## 验证指南

**动态内容豁免：** 仅在 `src/content/dynamic/` 下新增或修改动态内容及配图，且按照本指南和 [动态内容存放与发布规范](docs/dynamic-content.md) 操作时，完成文件写入即可，无需任何额外验证。不运行字段解析、格式检查、`pnpm check`、Biome 检查、`pnpm build`，也不启动开发预览或执行手动页面验证。

当前没有独立的测试框架或覆盖率目标。除上述动态内容豁免外，每次变更均应运行 `pnpm check`、Biome 检查和 `pnpm build`，并在 `pnpm dev` 中手动验证受影响的路由。修改内容时，遵循 `src/content.config.ts`：博客文章必填 `title` 和 `published`，动态仅必填 `published`。若同时修改集合 schema、配置、组件或页面渲染逻辑，仍按常规要求验证。

## 提交与拉取请求

近期提交历史同时使用简短聚焦的中文摘要，以及 `feat:`、`fix:`、`chore:` 等 Conventional Commit 前缀。推荐采用 `type: 简明说明` 格式（欢迎使用中文说明），不要在同一次提交中混入无关改动。

每个 PR 应只处理一个目标。按仓库模板填写变更类型、相关 Issue（如适用）、测试步骤；涉及可见 UI 变更时附上截图。确认必需检查通过，并避免提交 `.env` 文件或生成的构建产物。
