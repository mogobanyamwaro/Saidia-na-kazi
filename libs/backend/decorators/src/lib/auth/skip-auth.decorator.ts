import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH } from '@saidia-na-kazi/backend/auth';

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
