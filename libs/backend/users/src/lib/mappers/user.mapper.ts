import { CreateUserInput } from '@saidia-na-kazi/backend/dtos';
import { User } from '@saidia-na-kazi/backend/entities';

import { UserResponse } from '../dtos/user.dto';

export class UserMapper {
  public static async toDto(user: User) {
    const dto = new UserResponse();
    dto.id = user.id;
    dto.email = user.email;
    dto.isAdmin = user.isAdmin;
    dto.role = user.role;

    return dto;
  }

  public static toDtoWithRelations(user: User) {
    const dto = new UserResponse();
    dto.id = user.id;
    dto.email = user.email;
    dto.isAdmin = user.isAdmin;
    dto.role = user.role;

    return dto;
  }

  public static toCreateEntity(dto: CreateUserInput) {}
}
