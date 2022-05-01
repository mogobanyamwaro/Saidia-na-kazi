import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    example: 10,
  })
  skippedRecords: number;

  @ApiProperty({
    example: 10,
  })
  totalPages: number;

  @ApiProperty({ example: false })
  hasNext: boolean;

  @ApiProperty()
  content: T[];

  @ApiProperty({ example: 1 })
  payloadSize: number;

  @ApiProperty({ example: 1 })
  totalRecords: number;
}
