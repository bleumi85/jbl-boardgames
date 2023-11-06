import { Entity, Property } from '@mikro-orm/core';
import { CreationDateEntity } from './creation-date.entity';

@Entity({ abstract: true })
export abstract class DateEntity extends CreationDateEntity {
    @Property({
        type: 'timestamptz',
        onUpdate: () => new Date(),
        nullable: true,
        hidden: true,
    })
    updatedAt: Date | null;
}
