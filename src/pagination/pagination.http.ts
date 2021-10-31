import { HttpException, HttpStatus } from '@nestjs/common';
import { Pagination, PaginationParams } from './pagination.types';

export function extractAndAssertPaginationParams(
  {
    defaultPageSize,
    maxPageSize,
  }: { defaultPageSize: number; maxPageSize: number },
  pageParam?: number,
  pageSizeParam?: number,
): PaginationParams {
  const page = pageParam || 0;
  const pageSize = pageSizeParam || defaultPageSize;

  if (page < 0) {
    throw new HttpException(
      `page must be greater than or equal to 0`,
      HttpStatus.BAD_REQUEST,
    );
  }
  if (pageSize < 1) {
    throw new HttpException(
      `pageSize must be greater than or equal to 1`,
      HttpStatus.BAD_REQUEST,
    );
  }
  if (pageSize > maxPageSize) {
    throw new HttpException(
      `pageSize must be less than or equal to ${maxPageSize}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  return {
    page,
    pageSize,
  };
}

export class PageOf<T> {
  data: T[];
  pagination: Pagination;
}

export function buildAndAssertPageOf<T>(
  data: T[],
  pagination: Pagination,
): PageOf<T> {
  if (pagination.total && pagination.currentPage > pagination.lastPage) {
    throw new HttpException(
      `page ${pagination.currentPage} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
  return {
    data,
    pagination,
  };
}
