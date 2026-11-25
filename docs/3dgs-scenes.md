# 高斯泼溅场景发布流程

网站导航的「高斯场景」打开 `/3dgs/`，每个场景在目录中占一行。新增场景时，在 `public/scenes/` 下放入模型、封面和 `scene.json`。Astro 会自动发现这条记录并生成详情页，目录只加载封面，访客打开详情页时才加载模型。

## 1. 准备模型

训练或编辑完成后，导出含高斯点数据的 `.ply`。在仓库根目录用 PlayCanvas 的 SplatTransform 生成供网页发布的 SOG。以下以新场景 `my-scene` 为例，目录名建议使用小写英文字母、数字和连字符，它会成为永久链接的一部分。

```sh
scene_dir=public/scenes/my-scene
mkdir -p "$scene_dir"
pnpm dlx @playcanvas/splat-transform@3.12.0 "/path/to/edited.ply" "$scene_dir/scene.sog"
pnpm dlx @playcanvas/splat-transform@3.12.0 "$scene_dir/scene.sog" --info json null
```

把最后一条命令输出的 `numGaussians` 填入场景配置。SOG 转换和封面渲染在支持 WebGPU 的本机完成。可用 `pnpm dlx @playcanvas/splat-transform@3.12.0 --list-gpus` 查看 CLI 能识别的设备。GitHub Pages 构建直接使用生成的模型和封面。源 PLY 保存在自己的训练素材目录。若模型在查看器里侧倒，转换时可用 `--rotate=x,y,z` 调整并重新取景。咖啡豆场景转换时用了 `--rotate=-90,0,0`，具体角度取决于模型的坐标系。 [SplatTransform 命令参考](https://developer.playcanvas.com/user-manual/splat-transform/)

## 2. 设置初始视角和封面

先确定看向哪里，再确定相机位置和视野角度。封面使用真实模型的画面，文件名固定为 `cover.webp`，建议用 3∶2 构图。可以在 SuperSplat 编辑器里取景并导出画面，也可以用下列命令生成 720 × 480 的封面。

```sh
pnpm dlx @playcanvas/splat-transform@3.12.0 \
  --camera-pos=-0.07,0.24,0.15 --camera-target=-0.027,0.043,-0.016 \
  --camera-fov=39 --camera-near=0.005 --resolution=720x480 \
  "$scene_dir/scene.sog" "$scene_dir/cover.webp"
```

上面的相机位置和目标取自咖啡豆场景。新增场景时按实际尺寸和朝向重新取景。封面渲染用的视野角度与详情页可分别调整，最终以桌面和手机预览的实际构图为准。 [咖啡豆场景示例](../public/scenes/coffee-beans/)

## 3. 添加场景配置

最终目录包含以下三个文件：

```text
public/scenes/my-scene/
  scene.sog
  cover.webp
  scene.json
```

`scene.json` 的结构如下。示例使用仓库中咖啡豆场景的实测值，新增场景时填写自己的名称、点数和视角。

```json
{
  "title": "咖啡豆",
  "model": "scene.sog",
  "gaussians": 151620,
  "camera": {
    "position": [-0.07, 0.24, 0.15],
    "target": [-0.027, 0.043, -0.016],
    "fov": 51
  }
}
```

- `title` 是目录和详情页显示的名称，`model` 是同目录内的模型文件名。
- `gaussians` 填写模型检查输出的正整数点数。页面显示这个配置值。
- `position` 和 `target` 分别是相机位置和观察目标，按 `[x, y, z]` 填写。当前查看器的 `fov` 接受 10–120 度。

`scenes` 集合读取 `public/scenes/*/scene.json`，用文件夹名生成 `/3dgs/<场景名>/`。上例如果放在 `public/scenes/my-scene/`，详情页就是 `/3dgs/my-scene/`。 [集合定义](../src/content.config.ts)

## 4. 预览和发布

1. 运行 `pnpm dev`，从主页导航进入 `/3dgs/`，确认新场景显示一行，封面、名称和点数正确。
2. 打开场景，确认模型加载完成、初始取景合适。桌面验证拖动与缩放，手机验证竖屏与触控，最后点左上角「返回主页」。
3. 运行 `pnpm check`、`pnpm exec biome ci ./src` 和 `pnpm build`。构建会更新 `src/constants/lqips.json`，检查其中的封面缓存条目，并将相关变更与场景文件一起提交。
4. 推到 `master` 后，现有 GitHub Actions 会构建并发布 GitHub Pages。部署完成后，从线上首页进入新场景，核对目录、模型加载和返回主页。 [部署工作流](../.github/workflows/deploy.yml)
