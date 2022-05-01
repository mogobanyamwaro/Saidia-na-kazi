import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';

@Module({
  controllers: [ProviderController],
  providers: [],
  exports: [],
})
export class BackendProvidersModule {}
