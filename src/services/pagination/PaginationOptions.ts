export interface PaginationOptions<T> {
  items: T[];
  page: number | string;
  itemsPerPage?: number;
  basePath: string;
  isIndex?: boolean;
}
