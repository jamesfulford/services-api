import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Service } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async searchServices(orgId: number, name: string): Promise<any> {
    // TODO(james): `Like` looks like a bad idea here.
    return this.serviceRepository.find({
      where: { orgId, name: Like(`%${name}%`) },
    });
  }

  async getService(orgId: number, id: string): Promise<Service | undefined> {
    return this.serviceRepository.findOne({ where: { id, orgId } });
  }
}
