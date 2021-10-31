import { Version, VersionStatus } from './version.entity';

export class VersionDto {
  // not exposing id, unnecessary for now
  name: string;
  status: VersionStatus;
  swaggerLink: string;
}

export function convertVersionToDto(version: Version): VersionDto {
  return {
    name: version.name,
    status: version.status,
    swaggerLink: version.swaggerLink,
  };
}
