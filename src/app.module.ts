import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfigModule } from './database-config/database-config.module';
import { DatabaseConfigService } from './database-config/database-config.service';

@Module({
  imports: [
    ServicesModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: (databaseConfigService: DatabaseConfigService): Promise<TypeOrmModuleOptions> => databaseConfigService.getDatabaseConfig(),
      inject: [DatabaseConfigService]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
