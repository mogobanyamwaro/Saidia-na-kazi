import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import {
  BackendSharedModule,
  DbValidatorsModule,
} from '@saidia-na-kazi/backend/shared';
import { BackendUsersModule } from '@saidia-na-kazi/backend/users';
import { BackendAuthModule } from '@saidia-na-kazi/backend/auth';
import { BackendProvidersModule } from '@saidia-na-kazi/backend/providers';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
        synchronize: true,
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
    DbValidatorsModule.register({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    }),
    BackendSharedModule,
    BackendAuthModule,
    BackendUsersModule,
    BackendProvidersModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class BackendCoreModule {}
