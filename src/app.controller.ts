import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("/services")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  search(): any {
    return {
      data: this.appService.getServices(),
      meta: {
        orgId: "1",
      }
    };
  }
}
