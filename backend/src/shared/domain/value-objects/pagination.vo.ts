/**
 * Value Object base para paginação.
 * Imutável por design - segue princípios de DDD.
 */
export class PaginationVO {
  readonly page: number;
  readonly limit: number;
  readonly offset: number;

  constructor(page = 1, limit = 20) {
    this.page = Math.max(1, page);
    this.limit = Math.min(100, Math.max(1, limit));
    this.offset = (this.page - 1) * this.limit;
  }

  static create(page?: number, limit?: number): PaginationVO {
    return new PaginationVO(page, limit);
  }
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
