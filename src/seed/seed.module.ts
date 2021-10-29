import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/services/service.entity';
import { Version } from 'src/services/versions/version.entity';
import { SeedService } from './seed.service';

@Module({
  providers: [SeedService],
  imports: [TypeOrmModule.forFeature([Service, Version])],
  exports: [SeedService],
})
export class SeedModule {}
