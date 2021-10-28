import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServices(): any[] {
    return [
      {
        name: 'Hello'
      }
    ];
  }
}
