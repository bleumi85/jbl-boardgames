import { Entity, Enum, Property, Unique, Collection, OneToMany } from '@mikro-orm/core';
import { DateEntity } from '../../../database';
import { Role } from '../../../utils/enums';
import { RefreshToken } from './refresh-token.entity';

@Entity({ tableName: 'accounts' })
@Unique({ properties: ['firstName', 'lastName'], name: 'account_full_name_unique' })
export class Account extends DateEntity {
    @Property()
    public firstName: string;

    @Property()
    public lastName: string;

    @Property({ unique: true })
    public userName: string;

    @Property({ unique: true })
    public email: string;

    @Enum({
        items: () => Role,
        customOrder: [Role.Admin, Role.User, Role.Visitor],
        default: Role.Visitor,
    })
    public role: Role = Role.Visitor;

    @Property({ hidden: true })
    public passwordHash: string;

    @Property({ hidden: true, default: false })
    public acceptTerms: boolean = false;

    @Property({ hidden: true, nullable: true })
    public verificationToken?: string;

    @Property({ hidden: true, nullable: true })
    public verified?: Date;

    @Property({ hidden: true, nullable: true })
    public resetToken?: string;

    @Property({ hidden: true, nullable: true })
    public resetTokenExpires?: Date;

    @Property({ hidden: true, nullable: true })
    public passwordReset?: Date;

    @Property({ persist: false, hidden: true })
    get isVerified(): boolean {
        return !!(this.verified || this.passwordReset);
    }

    @Property({ persist: false })
    public jwtToken?: string;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.account, { hidden: true })
    public refreshTokens = new Collection<RefreshToken>(this);
}
