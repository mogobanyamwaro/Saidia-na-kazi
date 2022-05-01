import { ApiProperty } from '@nestjs/swagger';

export class Response<T> {
  @ApiProperty({
    description: 'The payload of the response',
  })
  data: T;

  @ApiProperty({
    description: 'The timestamp of the response',
  })
  timeStamp: string;
}
