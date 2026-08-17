# 仓库指南

## 项目结构与模块组织

Firefly 是一款包含 Svelte 交互组件的 Astro 7 静态博客主题。基于文件的路由位于 `src/pages/`；共享的 Astro 与 Svelte UI 按用途组织在 `src/components/` 下（如 `layout/`、`widget/`、`controls/` 和 `pages/`）。可复用布局、工具函数、样式、i18n 文案和功能配置分别位于 `src/layouts/`、`src/utils/`、`src/styles/`、`src/i18n/` 和 `src/config/`。

站点内容位于 `src/content/`：文章在 `posts/`，独立页面在 `spec/`，动态在 `dynamic/`。其 frontmatter 结构由 `src/content.config.ts` 定义。源码图片放入 `src/assets/`；需要直接提供给浏览器的文件、画廊媒体和应用资源放入 `public/`。图标与 LQIP 等构建辅助脚本位于 `scripts/`。

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

当前没有独立的测试框架或覆盖率目标。每次变更均应运行 `pnpm check`、Biome 检查和 `pnpm build`，并在 `pnpm dev` 中手动验证受影响的路由。修改内容时，确认 frontmatter 符合 `src/content.config.ts`，尤其是文章必填字段 `title` 和 `published`。

## 提交与拉取请求

近期提交历史同时使用简短聚焦的中文摘要，以及 `feat:`、`fix:`、`chore:` 等 Conventional Commit 前缀。推荐采用 `type: 简明说明` 格式（欢迎使用中文说明），不要在同一次提交中混入无关改动。

每个 PR 应只处理一个目标。按仓库模板填写变更类型、相关 Issue（如适用）、测试步骤；涉及可见 UI 变更时附上截图。确认必需检查通过，并避免提交 `.env` 文件或生成的构建产物。
