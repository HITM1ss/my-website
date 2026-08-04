import type { AppConfig } from "../types/appConfig";

export const appConfig: AppConfig = [
  {
    name: "AI 每日晨报",
    description: "聚合每日 AI 模型、产品、行业、论文与技巧动态。",
    url: "/app/ai-daily.html",
    icon: "material-symbols:auto-awesome",
    image: "/app/ai-daily-preview.svg",
    tags: ["AI", "日报", "资讯"],
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
