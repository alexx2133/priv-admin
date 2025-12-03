export interface News {
  id: number;
  title: string;
  image: string;
  text: string;
  date: string; // datetime format
}

export interface NewsResponse {
  news: News[];
  count: number;
}

export interface SingleNewsResponse {
  news: News;
}
