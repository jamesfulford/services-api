import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService {
    searchServices(name: string): string {
        return `Searching services with name: ${name}`;
    }
}
