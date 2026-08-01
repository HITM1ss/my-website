# 应用页面接入说明

本说明文档用于记录如何在当前项目中新增一个 HTML 应用，并保证其他人也能理解维护流程。

## 目录结构说明

当前“应用”功能由四个主要部分组成：

1. `src/pages/app/index.astro`
   - 这是应用首页，用来展示当前已注册的应用列表。
   - 当用户点击导航栏的“应用”时，会进入这个页面。

2. `src/config/appConfig.ts`
   - 用于集中管理应用模块的属性。
   - 支持 `name`、`description`、`url`、`icon`、`image`、`tags`、`enabled` 等字段。

3. `src/types/appConfig.ts`
   - 定义应用模块的类型 `AppItem` 和 `AppConfig`。
   - 让新增应用时有类型提示，便于后续维护。

4. `public/app/` 目录
   - 存放实际的静态 HTML 应用文件。
   - 每个应用可以是一个 `html` 页面，或一个包含资源的子目录。

5. `src/config/navBarConfig.ts`
   - 控制导航栏是否显示“应用”入口，并映射到 `/app/` 页面。

---

## 当前实现方式

### 应用首页 `src/pages/app/index.astro`

此页面使用 `MainGridLayout` 统一站点样式，并通过一个 `apps` 数组展示应用卡片。

每个应用条目包含：

- `name`：应用名称
- `description`：应用简介
- `url`：应用实际链接，如 `/app/shibuya.html`
- `icon`：图标名称
- `image`：应用预览图链接
- `tags`：应用标签
- `enabled`：是否在应用页面中显示（可选，默认显示）

当用户点击卡片时，会跳转到对应的 HTML 应用页面。

### 静态应用页面 `public/app/shibuya.html`

这是第一个示例应用页面，直接使用纯静态 HTML + Three.js 在浏览器中渲染。

由于放在 `public/` 下，构建后会成为静态资源，用户可以通过 `/app/shibuya.html` 直接访问。

### 导航入口 `src/config/navBarConfig.ts`

导航入口保持为：

```ts
links.push({
  name: "应用",
  url: "/app/",
  icon: "material-symbols:apps",
});
```

这样“应用”入口会指向应用列表页，而不是直接跳转到某个具体 HTML 页面。

---

## 新增 HTML 应用的步骤

### 1. 准备 HTML 应用页面

在 `public/app/` 下新增一个文件，例如：

```text
public/app/my-game.html
```

这个 HTML 文件可以包含：

- `<canvas>`、Three.js、WebGL 逻辑
- 纯 CSS / JS 的小游戏
- 任意静态前端应用

只要不依赖服务器端渲染，放到 `public/` 下即可直接访问。

### 2. 在应用展示页注册新应用

打开 `src/config/appConfig.ts`，在配置数组中新增一个条目：

```ts
export const appConfig: AppConfig = [
  {
    name: "渋谷スクランブル交差点",
    description: "夜晚的 Shibuya 3D 体验，点击进入交差点场景。",
    url: "/app/shibuya.html",
    icon: "material-symbols:apps",
    image: "/app/shibuya-preview.svg",
    tags: ["3D", "游戏", "演示"],
    enabled: true,
  },
  {
    name: "我的新应用",
    description: "这是第二个 HTML 应用示例。",
    url: "/app/my-game.html",
    icon: "material-symbols:gamepad",
    image: "/app/my-game-preview.svg",
    tags: ["游戏", "互动"],
    enabled: true,
  },
];
```

这个页面会自动生成新的卡片列表，并保持与站点现有风格一致。

### 3. 确保导航仍指向 `/app/`

如果需要修改导航入口，检查 `src/config/navBarConfig.ts`：

```ts
links.push({
  name: "应用",
  url: "/app/",
  icon: "material-symbols:apps",
});
```

保持此入口不变，应用列表页会继续作为应用入口。

---

## 维护建议

- 新应用优先放在 `public/app/` 目录下，便于静态资源管理。
- 若希望新增多页应用，可在 `public/app/` 下创建子目录，例如：

```text
public/app/my-tool/index.html
```

然后在展示页中将 `url` 设置为 `/app/my-tool/`。

- 应用页面内部如果引用额外静态资源（图片、脚本、音频等），建议也放在 `public/app/` 或 `public/assets/` 下。
- 主页应用列表目前由 `src/config/appConfig.ts` 的 `appConfig` 数组维护，新增/更新时同步修改说明文档。

---

## 典型应用接入流程

1. 新建 HTML 文件：`public/app/new-app.html`
2. 新建或复制资源到 `public/app/` 目录
3. 在 `src/pages/app/index.astro` 中添加卡片信息
4. 本地预览：`pnpm dev`，访问 `/app/` 并确认卡片跳转正常

---

## 补充说明

如果后续希望把应用列表改成动态配置、或使用 `app` 集合管理，可以将 `apps` 数组抽离到 `src/config/appConfig.ts`，并在 `src/pages/app/index.astro` 中统一读取。这样后续维护会更方便。
