import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '@saidia-na-kazi/backend/decorators';
import { User } from '@saidia-na-kazi/backend/entities';
@Controller('social')
@ApiTags('social')
export class ProviderController {
  @ApiOperation({ summary: 'get all of my posts' })
  @Get('my-posts')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  getmyPosts(@AuthUser() user: User) {
    return user;
  }
}
