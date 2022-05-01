import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDocumentInput {
  @ApiProperty({
    description: 'Id of the document',
  })
  @IsUUID()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({
    description: 'File Id to be added',
  })
  @IsUUID()
  @IsString()
  @IsOptional()
  fileId: string;

  @ApiProperty({
    description: 'document Issue Date',
  })
  @IsOptional()
  issueDate: Date;

  @ApiProperty({
    description: 'document Expired Date',
  })
  @IsOptional()
  expiryDate: Date;
}
