import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@saidia-na-kazi/backend/entities';
export const AuthUser = createParamDecorator<User>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
