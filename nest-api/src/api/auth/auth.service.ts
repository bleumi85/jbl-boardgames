import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../accounts/accounts.service';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { TokenPayload } from './token-payload.interface';
import { Account, RefreshToken } from '../accounts';
import { EntityManager } from '@mikro-orm/postgresql';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly em: EntityManager,
    ) {}

    public async getAuthenticatedAccount(userName: string, plainTextPassword: string) {
        try {
            const account = await this.accountsService.findOneByUsername(userName);
            await this.verifyPassword(plainTextPassword, account.passwordHash);
            return account;
        } catch {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public async generateRefreshToken(account: Account, ipAddress: string) {
        const refreshToken = this.em.create(RefreshToken, {
            account,
            token: this.randomTokenString(),
            expires: new Date(Date.now() + 1000 * this.configService.get<number>('jwt.refreshExpTime')),
            createdByIp: ipAddress,
        });

        await this.em.persistAndFlush(refreshToken);

        const payload: JwtPayload = { token: refreshToken.token };

        const signedToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.secret'),
            expiresIn: `${this.configService.get<number>('jwt.refreshExpTime')}s`,
        });

        return { token: refreshToken.token, signedToken };
    }

    public async revokeOldToken(oldToken: string, newToken: string, ipAddress: string) {
        const refreshToken = await this.accountsService.findOneRefreshTokenByToken(oldToken);

        refreshToken.revoked = new Date();
        refreshToken.revokedByIp = ipAddress;
        refreshToken.replacedByToken = newToken;

        await this.em.persistAndFlush(refreshToken);
    }

    public getJwtToken(accountId: string, isSecondFactorAuthenticated = false) {
        const payload: TokenPayload = { accountId, isSecondFactorAuthenticated };
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('jwt.secret'),
            expiresIn: `${this.configService.get<number>('jwt.expTime')}s`,
        });
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    private randomTokenString(): string {
        return crypto.randomBytes(40).toString('hex');
    }
}
