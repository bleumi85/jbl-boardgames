import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Account } from './account.entity';
import { CreationDateEntity } from '../../../database';

@Entity({ tableName: 'refresh_tokens' })
export class RefreshToken extends CreationDateEntity {
    @ManyToOne(() => Account)
    public account: Account;

    @Property({ nullable: true })
    public token: string;

    @Property({ type: 'timestamptz', nullable: true })
    public expires: Date;

    @Property({ nullable: true })
    public createdByIp: string;

    @Property({ type: 'timestamptz', nullable: true })
    public revoked: Date;

    @Property({ nullable: true })
    public revokedByIp: string;

    @Property({ nullable: true })
    public replacedByToken: string;

    @Property({ persist: false })
    get isExpired(): boolean {
        return new Date(Date.now()) >= this.expires;
    }

    @Property({ persist: false })
    get isActive(): boolean {
        return !this.revoked && !this.isExpired;
    }

    constructor(partial: Partial<RefreshToken>) {
        super();
        Object.assign(this, partial);
    }
}
