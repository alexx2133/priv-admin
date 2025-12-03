export interface Category {
  id: number;
  name: string;
  image: string;
  sort: number;
}
export interface History {
  id?: number;
  year: number;
  text: string;
  sort: number;
}
export interface CategoriesResponse {
  categories: Category[];
  count: number;
}
export interface HistoriesResponse {
  histories: History[];
  count: number;
}

export interface CategoryResponse {
  category: Category;
}
export interface HistoryResponse {
  history: History;
}

export interface CreateCategoryData {
  name: string;
  image?: string;
  sort?: number;
}

export interface UpdateCategoryData {
  name?: string;
  image?: string;
  sort?: number;
}
