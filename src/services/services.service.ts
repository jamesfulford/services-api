import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  mapPaginationParamsToSkipTake,
  buildPagination,
} from 'src/pagination/pagination.typeorm';
import { Pagination, PaginationParams } from 'src/pagination/pagination.types';
import { ILike, Repository } from 'typeorm';
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

    const [services, total] = await this.serviceRepository.findAndCount({
      where: {
        orgId,
        // only search for name if truthy
        ...(name && { name: ILike(`%${escapeLikeString(name)}%`) }),
      },
      relations: ['versions'],
      take,
      skip,
      // assumption: "Services" will not be created or edited
      // between page calls (meaning pagination is stable).
      // (if was not stable, cursor pagination might be better choice)

      // so, we can sort by anything we want, so long as it's consistent across pages.
      order: {
        name: 'ASC',
      },
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
