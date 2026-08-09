export interface RetrievalService<T> {
  retrieve(): Promise<T[]>;
}
