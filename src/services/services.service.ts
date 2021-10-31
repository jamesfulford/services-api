import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  mapPaginationParamsToSkipTake,
  buildPagination,
} from 'src/pagination/pagination.typeorm';
import { Pagination, PaginationParams } from 'src/pagination/pagination.types';
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

  async searchServices(
    orgId: number,
    paginationParams: PaginationParams,
    name?: string,
  ): Promise<{
    services: Service[];
    pagination: Pagination;
  }> {
    const { skip, take } = mapPaginationParamsToSkipTake(paginationParams);

    // TODO(jamesfulford): add sorting
    const [services, total] = await this.serviceRepository.findAndCount({
      where: {
        orgId,
        // only search for name if truthy
        ...(name && { name: Like(`%${escapeLikeString(name)}%`) }),
      },
      relations: ['versions'],
      take,
      skip,
    });

    const pagination = buildPagination(total, paginationParams);

    return {
      services,
      pagination,
    };
  }

  async getService(orgId: number, id: string): Promise<Service | undefined> {
    return this.serviceRepository.findOne({
      where: { id, orgId },
      relations: ['versions'],
    });
  }
}
