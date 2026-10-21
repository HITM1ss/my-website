# 动态内容存放与发布规范

本文说明当前仓库的动态读取和显示规则，以及新增动态时建议沿用的文件约定。读取规则以源码为准；文件命名、图片目录等建议用于保持现有内容的一致性。

## 内容目录与文件名

动态存放在 `src/content/dynamic/`，每个 Markdown 文件对应一条动态。加载器递归读取该目录下的 `.md` 和 `.mdx`，支持子目录；图片等其他文件不会被读取为动态。

当前目录结构示例：

```text
src/content/dynamic/
├── 26.8.30.md
├── 26.8.31.md
└── image_d/
    ├── 8.30.avif
    └── 26.8.31.avif
```

现有动态采用 `YY.M.D.md` 命名，例如 `26.8.31.md`。建议新增时沿用这一约定；同一天有多条动态时，可用 `26.10.10-1.md`、`26.10.10-2.md` 等后缀区分。

代码不要求日期式文件名，也不会从文件名解析发布日期。文件名和所在子目录会参与页面锚点的生成，重命名或移动文件可能改变这条动态的固定链接。

## frontmatter 与正文

动态集合唯一声明的 frontmatter 字段是必填的 `published`，类型为日期。不需要 `title`；正文写在 frontmatter 后面，使用 Markdown 格式。

最小示例，可保存为 `src/content/dynamic/26.10.10.md`：

```markdown
---
published: 2026-10-10T18:30:00+08:00
---

今天的随手记录。
```

`published` 应使用不加引号的日期时间值，以便解析为日期并通过 `z.date()` 校验。建议新动态显式填写时区，例如上面的 `+08:00` 表示北京时间；给这个值加引号会使它成为字符串，无法通过当前 schema 校验。

已有动态的无时区写法，例如 `published: 2026-08-31 15:03:24`，当前按 UTC 解析。`siteConfig.timezone` 只控制页面显示时的时区转换，不会改变输入值的解析方式；当前设为 `Asia/Shanghai`，因此该例会显示为北京时间 23:03:24。

部分已有动态写了 `location`，但当前 schema 没有声明它，页面也不读取或显示它。需要把地点展示给读者时，可以直接写在正文中；仅增加 frontmatter 字段不会增加页面展示。

当前动态没有草稿、置顶或定时发布规则。`draft: true` 不能隐藏动态，未来的 `published` 时间也不会自动隐藏内容；保存到加载目录中的有效动态会参与页面生成。

## 图片存放与引用

现有动态图片集中放在 `src/content/dynamic/image_d/`。建议继续使用这个目录，并为新增图片选择容易对应动态的文件名。现有图片使用 AVIF，但代码没有要求只能使用这一格式。

位于动态目录根部的 Markdown 使用相对路径引用图片，例如：

```markdown
![一张银联一张VISA](image_d/26.8.31.avif)
```

图片路径相对于 Markdown 文件所在目录。若动态放入子目录，例如 `src/content/dynamic/2026/26.10.10.md`，引用共享图片目录时应相应调整：

```markdown
![图片说明](../image_d/26.8.31.avif)
```

引用前确认对应图片文件存在。图片说明使用非空的 `alt` 文本时，当前 Markdown 图片插件会将它显示为图下注释；`![](image_d/26.8.31.avif)` 不会生成这条注释。

## 页面显示与配置

- 首页 `/` 默认显示动态，原 `/dynamic/` 入口继续保留，两处共用 `src/components/pages/dynamic/DynamicFeed.astro`，按 `published` 的时间倒序排列；日期显示也使用该字段。
- 日志列表位于 `/blog/`，分页使用 `/blog/2/` 等地址，导航栏“文章”菜单中的“日志”进入此列表。文章正文仍使用 `/posts/.../`。旧日志分页地址如 `/2/` 会跳转到对应的新地址。
- 首页和原动态页都提供年份筛选和浏览器端分页，URL 使用 `year`、`page` 查询参数，例如 `/?year=2026&page=2` 或 `/dynamic/?year=2026&page=2`。
- `src/config/dynamicConfig.ts` 的 `itemsPerPage` 控制每页数量，目前是 `10`。
- `src/config/siteConfig.ts` 的 `pages.dynamic` 控制动态是否启用，目前是 `true`；关闭时首页跳转到 `/blog/`，原动态页跳转到 `/404/`。
- 每条动态的作者名称和头像统一读取 `src/config/profileConfig.ts` 的 `name`、`avatar`，不是动态文件中的独立字段。
- 每条动态的固定链接是动态页内的锚点，例如 `26.8.31.md` 当前对应 `/dynamic/#dynamic-26831`，没有单独的动态详情页。锚点由 Astro 生成的文件标识转换而来，分享时以页面的固定链接按钮为准。

分享后续页或筛选后的动态时，应保留当前 URL 的 `page`、`year` 查询参数。当前分页脚本不会根据锚点自动切换页码或年份，仅分享锚点可能使目标动态仍被隐藏。

## 新增动态步骤

1. 在 `src/content/dynamic/` 新建一个 `.md` 文件，建议按 `YY.M.D.md` 命名，同日多条时添加后缀。
2. 填写有效的 `published` 日期时间，并在 frontmatter 后写正文。
3. 如需图片，将文件放入 `image_d/`，在正文中使用相对于当前 Markdown 文件的图片路径。
4. 遵循本文规则新增或修改动态内容及配图时，写入完成即可，无需额外字段解析、检查、Biome、构建、开发预览或手动验证。

如果同时修改内容集合 schema、配置或页面渲染逻辑，则按 `AGENTS.md` 的常规要求验证。

## 源码依据

| 规则 | 源码 |
| --- | --- |
| 动态加载目录、扩展名、递归读取及 `published` 校验 | [`src/content.config.ts`](../src/content.config.ts) 中的 `dynamicCollection` |
| 动态读取、时间排序、作者资料、锚点、年份筛选和分页 | [`src/components/pages/dynamic/DynamicFeed.astro`](../src/components/pages/dynamic/DynamicFeed.astro) |
| 首页和原动态页入口 | [`src/pages/index.astro`](../src/pages/index.astro)、[`src/pages/dynamic/index.astro`](../src/pages/dynamic/index.astro) |
| 每页数量 | [`src/config/dynamicConfig.ts`](../src/config/dynamicConfig.ts) |
| 动态页面开关与站点日期显示设置 | [`src/config/siteConfig.ts`](../src/config/siteConfig.ts) |
| 作者名称和头像 | [`src/config/profileConfig.ts`](../src/config/profileConfig.ts) |
| 日期显示格式 | [`src/utils/date-utils.ts`](../src/utils/date-utils.ts) |
| 图片说明作为图注 | [`src/plugins/rehype-figure.mjs`](../src/plugins/rehype-figure.mjs) |

博客文章使用另一套 frontmatter，存放在 `src/content/posts/`；不要把文章的标题、标签、草稿等规则直接套用到动态。
