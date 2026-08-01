export interface AppItem {
  name: string;
  description: string;
  url: string;
  icon: string;
  image?: string;
  tags?: string[];
  enabled?: boolean;
}

export type AppConfig = AppItem[];
