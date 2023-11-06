import { Entity, Property } from '@mikro-orm/core';
import { PrimaryEntity } from './primary.entity';

@Entity({ abstract: true })
export abstract class CreationDateEntity extends PrimaryEntity {
    @Property({
        type: 'timestamptz',
        defaultRaw: 'current_timestamp',
        hidden: true,
    })
    public createdAt: Date = new Date();
}
