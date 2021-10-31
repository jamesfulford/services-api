import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService {
  getDatabaseConfig(): Promise<TypeOrmModuleOptions> {
    // (later, may read from a secrets store like Vault)
    const host = process.env.POSTGRES_HOST || 'localhost';
    const port = parseInt(process.env.POSTGRES_PORT, 10) || 5432;
    const username = process.env.POSTGRES_USER || 'rootuser';
    const password = process.env.POSTGRES_PASSWORD || 'rootpassword';
    const database = process.env.POSTGRES_DATABASE || 'test';
    const synchronize = (process.env.TYPEORM_SYNCHRONIZE || 'true') === 'true';

    return Promise.resolve({
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize,
    });
  }
}
