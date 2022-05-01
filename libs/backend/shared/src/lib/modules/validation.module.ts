import { Module, Provider, DynamicModule } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { DbConnectOptions } from '../interfaces';
import { QueryService, UtilService } from '../services';
import { IsUnique, Exists } from '../validators';

@Module({})
export class DbValidatorsModule {
  static register(options: DbConnectOptions): DynamicModule {
    return {
      module: DbValidatorsModule,
      providers: [...this.createConnectProviders(options), IsUnique, Exists],
      exports: [IsUnique, Exists],
      imports: [QueryService, UtilService],
    };
  }

  private static createConnectProviders(options: DbConnectOptions): Provider[] {
    return [
      {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () =>
          await createConnection({
            type: options.type,
            host: options.host,
            port: options.port,
            username: options.username,
            password: options.password,
            database: options.database,
          }),
      },
    ];
  }
}
