export interface PaginatedResult<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  items: T[];
  prevUrl: string;
  nextUrl: string;
}
