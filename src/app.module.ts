import { Module } from '@nestjs/common';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfigModule } from './database-config/database-config.module';
import { DatabaseConfigService } from './database-config/database-config.service';
import { SeedModule } from './seed/seed.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: (
        databaseConfigService: DatabaseConfigService,
      ): Promise<TypeOrmModuleOptions> =>
        databaseConfigService.getDatabaseConfig(),
      inject: [DatabaseConfigService],
    }),
    ServicesModule,
    SeedModule,
  ],
})
export class AppModule {}
