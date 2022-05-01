import { UserRoles } from '@saidia-na-kazi/backend/enum';

import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRoles;

  @ApiProperty()
  isAdmin: boolean;
}
