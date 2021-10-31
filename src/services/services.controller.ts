import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  buildAndAssertPageOf,
  extractAndAssertPaginationParams,
} from '../pagination/pagination.http';
import { convertServiceToDto } from './service.dto';
import { ServicesService } from './services.service';

@Controller({ path: '/organization/:orgId/services', version: '1' })
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServices(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query('page') pageParam?: number,
    @Query('pageSize') pageSizeParam?: number,
    @Query('name') name?: string,
  ) {
    // wrangle inputs
    const paginationParams = extractAndAssertPaginationParams(
      { defaultPageSize: 10, maxPageSize: 100 },
      pageParam,
      pageSizeParam,
    );

    // call service
    const { services, pagination } = await this.servicesService.searchServices(
      orgId,
      paginationParams,
      name,
    );

    // map results
    const page = buildAndAssertPageOf(
      services.map(convertServiceToDto),
      pagination,
    );

    return {
      meta: {
        orgId,
      },
      ...page,
    };
  }

  @Get('/:id')
  async getService(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const service = await this.servicesService.getService(orgId, id);
    if (!service) {
      throw new HttpException(
        `service '${id}' not found in org '${orgId}'`,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      meta: {
        orgId,
      },
      data: convertServiceToDto(service),
    };
  }
}
