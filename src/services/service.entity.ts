import { Version } from 'src/services/versions/version.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @PrimaryColumn()
  orgId: number;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 2048 })
  description: string;

  @OneToMany(() => Version, (version) => version.service)
  versions: Version[];
}
