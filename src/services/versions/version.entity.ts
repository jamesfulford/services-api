import { Service } from 'src/services/service.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum VersionStatus {
  DRAFT = 'DRAFT',
  LIVE = 'LIVE',
  DEPRECATED = 'DEPRECATED',
  END_OF_LIFE = 'END_OF_LIFE',
}

@Entity()
export class Version {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 1024 })
  swaggerLink: string;

  @Column({ type: 'enum', enum: VersionStatus, default: VersionStatus.DRAFT })
  status: VersionStatus;

  @ManyToOne(() => Service, (service) => service.versions)
  service: Service;
}
