import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServicesService } from './services.service';
import { Version } from './versions/version.entity';

@Module({
  providers: [ServicesService],
  imports: [TypeOrmModule.forFeature([Service, Version])],
  exports: [],
})
export class ServicesModule {}
