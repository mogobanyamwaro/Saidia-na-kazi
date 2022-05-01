import { PaginationRequest } from '../interfaces';
import { PaginationResponseDto } from './pagination-response.dto';

export class Pagination {
  /**
   *
   * @param { PaginationRequest} param0
   * @param { number } totalRecords
   * @param { T[]} dtos
   * @returns
   */
  static of<T>(
    { limit, page, skip }: PaginationRequest,
    totalRecords: number,
    dtos: T[]
  ): PaginationResponseDto<T> {
    const totalPages =
      Math.floor(totalRecords / limit) + (totalRecords % limit > 0 ? 1 : 0);
    const currentPage = +page > 0 ? +page : 1;
    const hasNext = currentPage < totalPages;

    return {
      totalPages,
      payloadSize: dtos.length,
      hasNext,
      currentPage,
      content: dtos,
      skippedRecords: skip,
      totalRecords: totalRecords,
    };
  }
}
