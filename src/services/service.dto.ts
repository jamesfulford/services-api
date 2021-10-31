import { Service } from './service.entity';
import { convertVersionToDto, VersionDto } from './versions/version.dto';

export class ServiceDto {
  id: string;
  name: string;
  description: string;
  version: VersionDto[];
}

export function convertServiceToDto(service: Service): ServiceDto {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    version: service.versions.map((version) => convertVersionToDto(version)),
  };
}
