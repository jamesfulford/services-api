import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../services/service.entity';
import { Version, VersionStatus } from '../services/versions/version.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,
  ) {}

  async seedVersion(name: string, service: Service): Promise<Version> {
    const version = new Version();
    version.name = name;
    version.status = VersionStatus.DRAFT;
    version.swaggerLink = 'https://swagger.io/v1';
    version.service = service;
    return await this.versionRepository.save(version);
  }

  async seedService(
    orgId: number,
    name: string,
    description: string = '',
  ): Promise<Service> {
    const service = new Service();
    service.orgId = orgId;
    service.name = name;
    service.description = description;

    return await this.serviceRepository.save(service);
  }

  async clearDatabase(): Promise<void> {
    const versions = await this.versionRepository.find();
    const services = await this.serviceRepository.find({
      where: { orgId: 1 },
      relations: ['versions'],
    });

    for (const version of versions) {
      await this.versionRepository.delete(version.id);
    }
    for (const service of services) {
      await this.serviceRepository.delete({
        id: service.id,
        orgId: service.orgId,
      });
    }
  }

  async seedDatabase(): Promise<void> {
    await this.clearDatabase();

    let service: Service;
    service = await this.seedService(1, 'Locate Us', 'Lorem ipsum');
    await this.seedVersion('v1', service);

    service = await this.seedService(1, 'Collect Monday');
    await this.seedVersion('v1', service);

    service = await this.seedService(1, 'Contact Us');
    await this.seedVersion('v1', service);

    service = await this.seedService(1, 'Contact Us');
    await this.seedVersion('v1', service);
    await this.seedVersion('v2', service);
    await this.seedVersion('v3', service);

    service = await this.seedService(1, 'FX Rates International', 'Lorem 1');

    service = await this.seedService(1, 'FX Rates International', 'Lorem 2');
    await this.seedVersion('v1', service);
  }
}
