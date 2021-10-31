import { Pagination, PaginationParams } from './pagination.types';

// helper to convert PaginationParams to TypeOrm-friendly skip-take offset params
export function mapPaginationParamsToSkipTake({
  page,
  pageSize,
}: PaginationParams): SkipTake {
  const skip = page * pageSize;
  const take = pageSize;
  return { skip, take };
}

export class SkipTake {
  skip: number;
  take: number;
}

export function buildPagination(
  total: number,
  { page, pageSize }: PaginationParams,
): Pagination {
  return {
    total,
    pageSize,
    // page 0 is first page
    firstPage: 0,
    currentPage: page,
    nextPage: total > (page + 1) * pageSize ? page + 1 : null,
    lastPage: Math.max(Math.ceil(total / pageSize) - 1, 0),
  };
}
