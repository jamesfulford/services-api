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
import { convertServiceToDto } from './service.dto';
import { ServicesService } from './services.service';

@Controller('/organization/:orgId/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServices(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query('name') name?: string,
  ) {
    const services = await this.servicesService.searchServices(orgId, name);
    return {
      meta: {
        orgId,
      },
      data: services.map(convertServiceToDto),
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
