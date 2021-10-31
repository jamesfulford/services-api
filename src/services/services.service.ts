import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Service } from './service.entity';

// TypeORM does not seem to do escaping very well, so we need to do it manually
// https://github.com/typeorm/typeorm/issues/5012#issuecomment-843969810
function escapeLikeString(raw: string): string {
  return raw.replace(/[\\%_]/g, '\\$&');
}

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async searchServices(orgId: number, name?: string): Promise<any> {
    // TODO(jamesfulford): add pagination

    return this.serviceRepository.find({
      where: {
        orgId,
        // only search for name if truthy
        ...(name && { name: Like(`%${escapeLikeString(name)}%`) }),
      },
      relations: ['versions'],
    });
  }

  async getService(orgId: number, id: string): Promise<Service | undefined> {
    return this.serviceRepository.findOne({
      where: { id, orgId },
      relations: ['versions'],
    });
  }
}
