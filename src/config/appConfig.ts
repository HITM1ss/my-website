import type { AppConfig } from "../types/appConfig";

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
    name: "Tech Kanban",
    description: "科技风待办事项看板，支持卡片拖拽与分栏视图（示例）。",
    url: "/app/trello.html",
    icon: "material-symbols:view-kanban",
    image: "/app/trello-preview.svg",
    tags: ["看板", "任务", "交互"],
    enabled: true,
  },
];
