export class PaginationParams {
  page: number; // semantics: page 0 is first page
  pageSize: number;
}

export class Pagination {
  total: number;
  pageSize: number;

  firstPage: number;
  currentPage: number;
  nextPage: number;
  lastPage: number;
}
