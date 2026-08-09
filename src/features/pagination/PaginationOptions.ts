export interface PaginationOptions<T> {
  items: T[];
  page?: number | string;
  basePath: string;
  isIndex?: boolean;
}
