// types.ts
export interface Banner {
  id: number;
  group_id: number;
  url: string;
  text: string;
  status: number;
  sort: number;
}

export interface BannerHistory {
  id: number;
  banner_id: number;
  start: string; // DATE string
  end: string | null; // DATE string or null
}
